#!/usr/bin/env python3
"""Build the public one-page Maple Leaf Intelligence case studies."""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".pdf-tools"))

from PIL import Image, ImageOps
from pypdf import PdfReader
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


OUTPUT = ROOT / "output" / "pdf"
PUBLIC = ROOT / "public" / "downloads"
TMP = ROOT / "tmp" / "pdfs"
LEAF = ROOT / "public" / "assets" / "maple-leaf.png"

INK = HexColor("#171C26")
MUTED = HexColor("#59616F")
NAVY = HexColor("#1D2A41")
ORANGE = HexColor("#FF9A5C")
ORANGE_STRONG = HexColor("#E96824")
ORANGE_SOFT = HexColor("#FFF0E6")
PAPER = HexColor("#F5F6F8")
WHITE = HexColor("#FFFFFF")
RULE = HexColor("#DFE2E7")
GREEN = HexColor("#19735A")

FONT_REGULAR = "Helvetica"
FONT_BOLD = "Helvetica-Bold"


def register_optional_fonts() -> None:
    """Use an installed system sans when available, with Helvetica fallback."""
    global FONT_REGULAR, FONT_BOLD
    candidates = [
        (
            Path("/System/Library/Fonts/SFNS.ttf"),
            Path("/System/Library/Fonts/SFNS.ttf"),
        ),
        (
            Path("/System/Library/Fonts/Helvetica.ttc"),
            Path("/System/Library/Fonts/Helvetica.ttc"),
        ),
    ]
    for regular, bold in candidates:
        if not regular.exists():
            continue
        try:
            pdfmetrics.registerFont(TTFont("MapleSans", str(regular)))
            pdfmetrics.registerFont(TTFont("MapleSansBold", str(bold)))
            FONT_REGULAR = "MapleSans"
            FONT_BOLD = "MapleSansBold"
            return
        except Exception:
            continue


STUDIES = [
    {
        "slug": "clinical-queue-intelligence-case-study",
        "label": "CLINICAL OPERATIONS  |  24/7 SERVICE",
        "title": "Creating a live, trusted view of clinical queues",
        "summary": (
            "A clinical contact centre needed one dependable view of waiting demand, "
            "active work and pressure across its queues."
        ),
        "facts": [
            ("Environment", "24/7 clinical contact centre"),
            ("Need", "Reliable view of current queues"),
            ("Result", "Primary operational view"),
        ],
        "challenge": [
            (
                "The organisation's case-management system recorded thousands of "
                "individual movements and actions, but did not provide a stable account "
                "of each period a case spent in a queue."
            ),
            (
                "Cases could move between teams, change priority, leave and return. "
                "Team leaders were relying on manual checks to understand what was "
                "waiting and where pressure was building."
            ),
        ],
        "response": [
            (
                "Agreed what the service needed to see: current waiting demand, active "
                "work, priorities, elapsed time and the longest waits."
            ),
            (
                "Reconstructed the history of each queue placement so that movements "
                "and current states could be represented consistently."
            ),
            (
                "Delivered a near-live operational wallboard, with the detail needed "
                "to move from service-wide pressure to individual cases."
            ),
        ],
        "outcomes": [
            "A shared view replaced repeated manual checks across operational teams.",
            "Leaders could see emerging pressure and the longest waits in one place.",
            "The same trusted account supported wider flow and performance reporting.",
        ],
        "highlight": "Continuous operational use",
        "image": ROOT / "public" / "screenshots" / "queue-wallboard.png",
        "image_caption": "An anonymised view of the operational queue wallboard.",
    },
    {
        "slug": "telephony-demand-workforce-case-study",
        "label": "CONTACT CENTRE  |  DEMAND AND WORKFORCE",
        "title": "Building one account of calls, service and workforce activity",
        "summary": (
            "A high-volume contact centre needed a consistent view of demand, service "
            "performance and the activity behind it."
        ),
        "facts": [
            ("Scale", "About 2.5m calls each year"),
            ("Need", "One dependable account"),
            ("Result", "Five connected reports"),
        ],
        "challenge": [
            (
                "Call and workforce information was spread across low-level platform "
                "records and externally produced outputs. Measures were difficult to "
                "reconcile and operational questions often required separate analysis."
            ),
            (
                "The organisation needed to understand overall demand and service, then "
                "move through calls, sessions and agent activity without changing the "
                "meaning of the measures along the way."
            ),
        ],
        "response": [
            (
                "Started with the service questions: when demand arrived, what happened "
                "to each call and how workload related to available staff."
            ),
            (
                "Rebuilt the account of calls and activity around the organisation's own "
                "records, with consistent rules for transfers and ownership."
            ),
            (
                "Created five connected reports for demand, performance, workforce "
                "planning, operational review and detailed investigation."
            ),
        ],
        "outcomes": [
            "All telephony and agent reporting moved to one governed source.",
            "Operational teams could move from service trends to supporting detail.",
            "The organisation gained a reusable base for planning and investigation.",
        ],
        "highlight": "2.5m calls represented annually",
        "image": ROOT / "public" / "screenshots" / "agent-summary.png",
        "image_caption": "An anonymised workforce activity summary from the reporting suite.",
    },
    {
        "slug": "waiting-time-kpi-case-study",
        "label": "PERFORMANCE MANAGEMENT  |  WAITING TIME",
        "title": "Defining a waiting-time measure the service could trust",
        "summary": (
            "A health-service team needed one defensible measure of how long cases "
            "waited for assessment across a changing operational workflow."
        ),
        "facts": [
            ("Question", "How long did cases wait?"),
            ("Need", "One operational definition"),
            ("Result", "Transparent performance view"),
        ],
        "challenge": [
            (
                "Several timestamps could plausibly mark the start or end of a wait. "
                "Cases could also move between levels, leave and return, or follow "
                "different routes into assessment."
            ),
            (
                "Each interpretation produced a different answer. A useful measure had "
                "to reflect how the service understood the wait, deal openly with "
                "exceptions and remain stable when the workflow changed."
            ),
        ],
        "response": [
            (
                "Mapped the operational journey and agreed the event that best "
                "represented the start and end of the wait."
            ),
            (
                "Set clear rules for movement, re-entry, missing markers and changes "
                "in the way assessments were started."
            ),
            (
                "Designed reporting that showed typical waits, long waits and the full "
                "shape of performance, with definitions and caveats kept visible."
            ),
        ],
        "outcomes": [
            "Leaders gained one transparent and repeatable waiting-time measure.",
            "Variation hidden by a single average became visible and investigable.",
            "The documented method became a reference for other complex measures.",
        ],
        "highlight": "One governed definition",
        "image": ROOT / "public" / "screenshots" / "kpi.png",
        "image_caption": "An anonymised performance view showing trends and variation.",
    },
]


def paragraph(text: str, style: ParagraphStyle, width: float) -> tuple[Paragraph, float]:
    item = Paragraph(text, style)
    _, height = item.wrap(width, 200 * mm)
    return item, height


def draw_paragraph(
    c: canvas.Canvas,
    text: str,
    style: ParagraphStyle,
    x: float,
    y: float,
    width: float,
) -> float:
    item, height = paragraph(text, style, width)
    item.drawOn(c, x, y - height)
    return y - height


def crop_preview(source: Path, destination: Path) -> None:
    with Image.open(source) as image:
        image = image.convert("RGB")
        crop = ImageOps.fit(image, (1800, 410), method=Image.Resampling.LANCZOS)
        crop.save(destination, quality=91, optimize=True)


def rounded_panel(c: canvas.Canvas, x: float, y: float, w: float, h: float, fill, radius=5 * mm):
    c.setFillColor(fill)
    c.setStrokeColor(RULE)
    c.setLineWidth(0.6)
    c.roundRect(x, y, w, h, radius, fill=1, stroke=1)


def build_study(study: dict) -> Path:
    output_path = OUTPUT / f"{study['slug']}.pdf"
    preview_path = TMP / f"{study['slug']}-preview.jpg"
    crop_preview(study["image"], preview_path)

    c = canvas.Canvas(str(output_path), pagesize=A4, pageCompression=1)
    c.setTitle(study["title"])
    c.setAuthor("Maple Leaf Intelligence")
    c.setSubject("Operational analytics case study")
    width, height = A4
    margin = 17 * mm
    content_width = width - 2 * margin

    title_style = ParagraphStyle(
        "title",
        fontName=FONT_BOLD,
        fontSize=23,
        leading=25.2,
        textColor=INK,
        alignment=TA_LEFT,
        spaceAfter=0,
    )
    summary_style = ParagraphStyle(
        "summary",
        fontName=FONT_REGULAR,
        fontSize=10.1,
        leading=14.2,
        textColor=MUTED,
    )
    body_style = ParagraphStyle(
        "body",
        fontName=FONT_REGULAR,
        fontSize=8.4,
        leading=11.4,
        textColor=MUTED,
    )
    step_style = ParagraphStyle(
        "step",
        fontName=FONT_REGULAR,
        fontSize=8.25,
        leading=11.2,
        textColor=INK,
    )
    outcome_style = ParagraphStyle(
        "outcome",
        fontName=FONT_REGULAR,
        fontSize=8.15,
        leading=10.8,
        textColor=INK,
    )

    c.setFillColor(PAPER)
    c.rect(0, 0, width, height, fill=1, stroke=0)

    # Brand header
    y = height - 14 * mm
    c.drawImage(str(LEAF), margin, y - 8.5 * mm, 8.5 * mm, 8.5 * mm, mask="auto")
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 10.5)
    c.drawString(margin + 11 * mm, y - 3.1 * mm, "Maple Leaf Intelligence")
    c.setFillColor(MUTED)
    c.setFont(FONT_BOLD, 5.7)
    c.drawString(margin + 11 * mm, y - 6.4 * mm, "OPERATIONAL INTELLIGENCE FOR HEALTH SERVICES")
    c.setFillColor(ORANGE_SOFT)
    c.roundRect(width - margin - 31 * mm, y - 8.2 * mm, 31 * mm, 8.2 * mm, 3 * mm, fill=1, stroke=0)
    c.setFillColor(ORANGE_STRONG)
    c.setFont(FONT_BOLD, 6.6)
    c.drawCentredString(width - margin - 15.5 * mm, y - 5.4 * mm, "CASE STUDY")

    y -= 17 * mm
    c.setFillColor(ORANGE_STRONG)
    c.setFont(FONT_BOLD, 6.6)
    c.drawString(margin, y, study["label"])
    y -= 5 * mm
    y = draw_paragraph(c, study["title"], title_style, margin, y, 160 * mm)
    y -= 3.2 * mm
    y = draw_paragraph(c, study["summary"], summary_style, margin, y, 150 * mm)
    y -= 6 * mm

    # At-a-glance facts
    fact_height = 18 * mm
    rounded_panel(c, margin, y - fact_height, content_width, fact_height, WHITE, 4 * mm)
    fact_width = content_width / len(study["facts"])
    for index, (label, value) in enumerate(study["facts"]):
        x = margin + fact_width * index
        if index:
            c.setStrokeColor(RULE)
            c.line(x, y - fact_height + 4 * mm, x, y - 4 * mm)
        c.setFillColor(ORANGE_STRONG)
        c.setFont(FONT_BOLD, 5.8)
        c.drawString(x + 5 * mm, y - 6 * mm, label.upper())
        c.setFillColor(NAVY)
        c.setFont(FONT_BOLD, 8.3)
        c.drawString(x + 5 * mm, y - 12.2 * mm, value)
    y -= fact_height + 6 * mm

    # Challenge and response
    gutter = 7 * mm
    left_width = 66 * mm
    right_width = content_width - left_width - gutter
    section_top = y
    c.setFillColor(ORANGE_STRONG)
    c.setFont(FONT_BOLD, 6.2)
    c.drawString(margin, section_top, "THE ORGANISATION'S CHALLENGE")
    left_y = section_top - 5 * mm
    for text in study["challenge"]:
        left_y = draw_paragraph(c, text, body_style, margin, left_y, left_width)
        left_y -= 3.2 * mm

    right_x = margin + left_width + gutter
    c.setFillColor(ORANGE_STRONG)
    c.setFont(FONT_BOLD, 6.2)
    c.drawString(right_x, section_top, "WHAT MAPLE LEAF DID")
    right_y = section_top - 4.8 * mm
    for index, text in enumerate(study["response"], start=1):
        c.setFillColor(ORANGE_SOFT)
        c.roundRect(right_x, right_y - 7.2 * mm, 7.2 * mm, 7.2 * mm, 2.1 * mm, fill=1, stroke=0)
        c.setFillColor(ORANGE_STRONG)
        c.setFont(FONT_BOLD, 6.5)
        c.drawCentredString(right_x + 3.6 * mm, right_y - 4.8 * mm, f"0{index}")
        step_y = draw_paragraph(c, text, step_style, right_x + 10 * mm, right_y, right_width - 10 * mm)
        right_y = min(step_y - 3.7 * mm, right_y - 14.5 * mm)

    y = min(left_y, right_y) - 2.5 * mm

    # Outcome band
    outcome_height = 38 * mm
    rounded_panel(c, margin, y - outcome_height, content_width, outcome_height, ORANGE_SOFT, 4 * mm)
    c.setFillColor(ORANGE_STRONG)
    c.setFont(FONT_BOLD, 6.2)
    c.drawString(margin + 6 * mm, y - 7 * mm, "WHAT CHANGED")
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 11)
    c.drawString(margin + 6 * mm, y - 15 * mm, study["highlight"])
    outcome_x = margin + 69 * mm
    outcome_y = y - 6.3 * mm
    outcome_width = content_width - 75 * mm
    for text in study["outcomes"]:
        c.setFillColor(ORANGE_STRONG)
        c.circle(outcome_x, outcome_y - 2.1 * mm, 1.2 * mm, fill=1, stroke=0)
        next_y = draw_paragraph(c, text, outcome_style, outcome_x + 4 * mm, outcome_y, outcome_width - 4 * mm)
        outcome_y = next_y - 2.8 * mm
    y -= outcome_height + 6 * mm

    # Visual evidence
    image_height = 38 * mm
    c.saveState()
    path = c.beginPath()
    path.roundRect(margin, y - image_height, content_width, image_height, 3.5 * mm)
    c.clipPath(path, stroke=0, fill=0)
    c.drawImage(
        str(preview_path),
        margin,
        y - image_height,
        content_width,
        image_height,
        preserveAspectRatio=False,
        mask="auto",
    )
    c.restoreState()
    c.setStrokeColor(RULE)
    c.setLineWidth(0.6)
    c.roundRect(margin, y - image_height, content_width, image_height, 3.5 * mm, fill=0, stroke=1)
    c.setFillColor(WHITE)
    c.roundRect(margin + 4 * mm, y - image_height + 4 * mm, 90 * mm, 8 * mm, 2.3 * mm, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont(FONT_BOLD, 6.2)
    c.drawString(margin + 7 * mm, y - image_height + 7 * mm, study["image_caption"])

    # Footer
    footer_y = 9 * mm
    c.setStrokeColor(RULE)
    c.line(margin, footer_y + 5 * mm, width - margin, footer_y + 5 * mm)
    c.setFillColor(MUTED)
    c.setFont(FONT_REGULAR, 5.8)
    c.drawString(margin, footer_y, "Anonymised to protect confidential operational information.")
    c.setFillColor(ORANGE_STRONG)
    c.setFont(FONT_BOLD, 6.2)
    footer_text = "mapleintel.uk  |  stephen@mapleintel.uk"
    c.drawRightString(width - margin, footer_y, footer_text)
    c.linkURL(
        "https://mapleintel.uk",
        (width - margin - 52 * mm, footer_y - 1 * mm, width - margin, footer_y + 3 * mm),
        relative=0,
    )

    c.showPage()
    c.save()

    if len(PdfReader(str(output_path)).pages) != 1:
        raise RuntimeError(f"{output_path.name} is not a single-page PDF")

    public_path = PUBLIC / output_path.name
    shutil.copy2(output_path, public_path)
    return output_path


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)
    register_optional_fonts()
    for study in STUDIES:
        path = build_study(study)
        print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
