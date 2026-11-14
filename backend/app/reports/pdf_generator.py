"""
PDF report generator using ReportLab.
Generates a professional two-page farm soil analysis report.
"""
from __future__ import annotations

import io
from datetime import datetime, timezone
from typing import TYPE_CHECKING

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak,
)

if TYPE_CHECKING:
    from app.models.farm import Farm
    from app.models.ml_model import Report
    from app.models.user import User

# Brand colours
BRAND_GREEN = colors.HexColor("#1a6b3c")
BRAND_LIGHT_GREEN = colors.HexColor("#e8f5e9")
BRAND_DARK = colors.HexColor("#1a1a2e")
BRAND_MUTED = colors.HexColor("#6b7280")
CAUTION_ORANGE = colors.HexColor("#f59e0b")


def _header_footer(canvas, doc):
    canvas.saveState()
    # Header bar
    canvas.setFillColor(BRAND_GREEN)
    canvas.rect(0, A4[1] - 1.8 * cm, A4[0], 1.8 * cm, fill=True, stroke=False)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 14)
    canvas.drawString(1.5 * cm, A4[1] - 1.2 * cm, "AI Bhoomi")
    canvas.setFont("Helvetica", 9)
    canvas.drawString(5.5 * cm, A4[1] - 1.2 * cm, "Understand Your Soil. Grow Smarter.")
    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(A4[0] - 1.5 * cm, A4[1] - 1.2 * cm,
                           f"Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")

    # Footer
    canvas.setStrokeColor(BRAND_GREEN)
    canvas.setLineWidth(0.5)
    canvas.line(1.5 * cm, 1.2 * cm, A4[0] - 1.5 * cm, 1.2 * cm)
    canvas.setFillColor(BRAND_MUTED)
    canvas.setFont("Helvetica", 7)
    canvas.drawString(1.5 * cm, 0.7 * cm,
                      "IMPORTANT: This report is for informational purposes only. "
                      "Consult a registered agronomist before making agronomic decisions.")
    canvas.drawRightString(A4[0] - 1.5 * cm, 0.7 * cm,
                           f"Page {doc.page}")
    canvas.restoreState()


def generate_farm_report_pdf(farm: "Farm", report: "Report", user: "User") -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=1.5 * cm,
        rightMargin=1.5 * cm,
        topMargin=2.5 * cm,
        bottomMargin=2 * cm,
    )
    styles = getSampleStyleSheet()
    h1 = ParagraphStyle("h1", parent=styles["Heading1"], textColor=BRAND_GREEN,
                         fontSize=16, spaceAfter=8)
    h2 = ParagraphStyle("h2", parent=styles["Heading2"], textColor=BRAND_DARK,
                         fontSize=12, spaceAfter=4)
    body = styles["BodyText"]
    small = ParagraphStyle("small", parent=body, fontSize=8, textColor=BRAND_MUTED)
    warning = ParagraphStyle("warning", parent=body, fontSize=9,
                              textColor=CAUTION_ORANGE, backColor=colors.HexColor("#fffbeb"),
                              borderPadding=4)

    story = []

    # ── PAGE 1 ────────────────────────────────────────────────────────────────
    story.append(Paragraph(f"Soil Analysis Report", h1))
    story.append(Paragraph(f"Report ID: {report.id}", small))
    story.append(Spacer(1, 0.3 * cm))
    story.append(HRFlowable(width="100%", thickness=1, color=BRAND_GREEN))
    story.append(Spacer(1, 0.4 * cm))

    # Farm details table
    farm_data = [
        ["Farm Name", farm.name or "—"],
        ["Owner", farm.owner_name or user.full_name or "—"],
        ["State", farm.state or "—"],
        ["District", farm.district or "—"],
        ["Village", farm.village or "—"],
        ["Land Record Ref.", farm.land_record_ref or "—"],
        ["Area (Hectares)", f"{farm.area_hectares:.4f} ha" if farm.area_hectares else "Not calculated"],
        ["Area (Acres)", f"{farm.area_acres:.4f} acres" if farm.area_acres else "Not calculated"],
        ["GPS (Lat, Lon)", f"{farm.latitude}, {farm.longitude}" if farm.latitude else "—"],
    ]
    farm_table = Table(
        [[Paragraph(f"<b>{k}</b>", body), Paragraph(str(v), body)] for k, v in farm_data],
        colWidths=[5 * cm, 12 * cm],
    )
    farm_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), BRAND_LIGHT_GREEN),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#d1d5db")),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, colors.HexColor("#f9fafb")]),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(Paragraph("Farm Details", h2))
    story.append(farm_table)
    story.append(Spacer(1, 0.5 * cm))

    # Soil data section
    story.append(Paragraph("Soil Measurements", h2))
    soil_header = [
        [Paragraph("<b>Parameter</b>", body), Paragraph("<b>Value</b>", body),
         Paragraph("<b>Unit</b>", body), Paragraph("<b>Source</b>", body),
         Paragraph("<b>Method</b>", body)]
    ]
    soil_rows = []
    for s in (farm.soil_samples or []):
        for m in (s.measurements or []):
            soil_rows.append([
                Paragraph(m.parameter.replace("_", " ").title(), body),
                Paragraph(str(m.value), body),
                Paragraph(m.unit, body),
                Paragraph(m.source.replace("_", " ").title(), body),
                Paragraph(m.method or "—", small),
            ])

    if not soil_rows:
        story.append(Paragraph(
            "No soil measurements recorded. Import laboratory data in the Soil Analysis section.",
            warning,
        ))
    else:
        soil_table = Table(
            soil_header + soil_rows,
            colWidths=[4 * cm, 3 * cm, 2.5 * cm, 3.5 * cm, 4 * cm],
        )
        soil_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), BRAND_GREEN),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#d1d5db")),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f9fafb")]),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(soil_table)

    story.append(Spacer(1, 0.5 * cm))

    # Data quality notice
    if report.contains_demo_data:
        story.append(Paragraph(
            "⚠ DEMO DATA NOTICE: This report may contain demonstration data that does not "
            "represent actual laboratory measurements or real satellite imagery. "
            "Data labeled as 'Demo' must not be used for agronomic decisions.",
            warning,
        ))
    story.append(Spacer(1, 0.5 * cm))

    # ── PAGE 2 ────────────────────────────────────────────────────────────────
    story.append(PageBreak())
    story.append(Paragraph("Recommendations & Data Provenance", h1))
    story.append(HRFlowable(width="100%", thickness=1, color=BRAND_GREEN))
    story.append(Spacer(1, 0.4 * cm))

    # Model/prediction disclaimer
    story.append(Paragraph("ML Predictions", h2))
    story.append(Paragraph(
        "No validated machine learning model is currently active for this farm. "
        "ML predictions will appear here once a validated model has been trained, "
        "reviewed, and activated by a qualified agronomist.",
        body,
    ))
    story.append(Spacer(1, 0.4 * cm))

    # Fertilizer notice
    story.append(Paragraph("Fertilizer Recommendations", h2))
    story.append(Paragraph(
        "Fertilizer recommendations require verified soil test results. "
        "Use the Recommendations section in the dashboard and select your crop to generate "
        "ICAR-referenced NPK doses for your farm area.",
        body,
    ))
    story.append(Spacer(1, 0.4 * cm))

    # Limitations
    story.append(Paragraph("Important Limitations", h2))
    limitations = [
        "Satellite-derived vegetation indices (NDVI, EVI) are not equivalent to laboratory "
        "measurements of nitrogen, phosphorus, potassium, or organic carbon.",
        "Farm boundary area calculations assume a WGS84 ellipsoidal model and may differ from "
        "official land survey records.",
        "Fertilizer doses in this report are derived from general ICAR reference values and "
        "must be reviewed by a registered agronomist before application.",
        "Satellite imagery availability depends on cloud cover, revisit frequency, and "
        "configuration of the Google Earth Engine account.",
        "This platform does not constitute a legal or certified soil report.",
    ]
    for lim in limitations:
        story.append(Paragraph(f" {lim}", body))
    story.append(Spacer(1, 0.4 * cm))

    # Data provenance
    story.append(Paragraph("Data Sources & Versions", h2))
    prov_data = [
        ["Data Type", "Source", "Notes"],
        ["Satellite Imagery", "Sentinel-2 SR Harmonized via GEE", "When configured"],
        ["Soil Measurements", "User-provided / Laboratory", "Verify with lab report"],
        ["Crop Rules", "Maharashtra Dept. of Agriculture", "General regional guidelines"],
        ["Fertilizer Doses", "ICAR-IISS 2020 edition", "Reference values only"],
        ["Soil Estimates", "SoilGrids v2.0 (ISRIC)", "250 m resolution contextual estimates"],
    ]
    prov_table = Table(
        [[Paragraph(f"<b>{c}</b>" if i == 0 else c, body) for c in row]
         for i, row in enumerate(prov_data)],
        colWidths=[4.5 * cm, 6 * cm, 6.5 * cm],
    )
    prov_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BRAND_GREEN),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#d1d5db")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f9fafb")]),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(prov_table)
    story.append(Spacer(1, 0.5 * cm))
    story.append(Paragraph(
        "Report generated by AI Bhoomi v1.0.0. "
        "For support, contact support@aibhoomi.in. "
        "This document is not a certified laboratory report.",
        small,
    ))

    doc.build(story, onFirstPage=_header_footer, onLaterPages=_header_footer)
    return buffer.getvalue()
