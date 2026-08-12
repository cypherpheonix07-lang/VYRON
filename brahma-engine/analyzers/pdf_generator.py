import io
import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def compile_pdf_report(title: str, description: str, health_score: int, data: dict) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Brand Colors
    navy_dark = colors.HexColor("#090910")
    navy_card = colors.HexColor("#0E0E1B")
    cyan_acc = colors.HexColor("#22D3EE")
    indigo_acc = colors.HexColor("#6366F1")
    text_white = colors.HexColor("#FFFFFF")
    text_gray = colors.HexColor("#94A3B8")
    border_color = colors.HexColor("#1E1E2F")
    
    # Custom Style Sheets
    style_title = ParagraphStyle(
        name="BrahmaTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=24,
        textColor=cyan_acc,
        leading=28,
        spaceAfter=15
    )
    
    style_h2 = ParagraphStyle(
        name="BrahmaH2",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=15,
        textColor=indigo_acc,
        leading=18,
        spaceBefore=15,
        spaceAfter=10,
        keepWithNext=True
    )
    
    style_body = ParagraphStyle(
        name="BrahmaBody",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10,
        textColor=text_gray,
        leading=14,
        spaceAfter=8
    )
    
    style_body_white = ParagraphStyle(
        name="BrahmaBodyWhite",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=10,
        textColor=text_white,
        leading=14
    )

    style_header_cell = ParagraphStyle(
        name="BrahmaHeaderCell",
        fontName="Helvetica-Bold",
        fontSize=10,
        textColor=cyan_acc,
        leading=12
    )

    # Pre-defined severity styles to avoid instantiation in the loop
    style_sev_critical = ParagraphStyle(
        name="BrahmaSevCritical",
        fontName="Helvetica-Bold",
        textColor=colors.HexColor("#EF4444")
    )
    style_sev_high = ParagraphStyle(
        name="BrahmaSevHigh",
        fontName="Helvetica-Bold",
        textColor=colors.HexColor("#F59E0B")
    )
    style_sev_medium = ParagraphStyle(
        name="BrahmaSevMedium",
        fontName="Helvetica-Bold",
        textColor=colors.HexColor("#3B82F6")
    )
    style_sev_low = ParagraphStyle(
        name="BrahmaSevLow",
        fontName="Helvetica-Bold",
        textColor=text_white
    )

    sev_style_map = {
        "Critical": style_sev_critical,
        "High": style_sev_high,
        "Medium": style_sev_medium,
        "Low": style_sev_low
    }

    story = []
    
    # --- Page 1: COVER PAGE ---
    story.append(Spacer(1, 100))
    story.append(Paragraph("PROJECT BRAHMA", style_title))
    story.append(Paragraph("System Architecture Specification Report", ParagraphStyle(
        name="BrahmaSubtitle",
        fontName="Helvetica-Bold",
        fontSize=14,
        textColor=text_white,
        leading=18,
        spaceAfter=30
    )))
    
    # Title Details Table
    info_data = [
        [Paragraph("Project Scope:", style_header_cell), Paragraph(title, style_body_white)],
        [Paragraph("Compiled Date:", style_header_cell), Paragraph(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), style_body_white)],
        [Paragraph("System Status:", style_header_cell), Paragraph(f"Overall Health: {health_score}/100", style_body_white)],
    ]
    t_info = Table(info_data, colWidths=[120, 360])
    t_info.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), navy_card),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 10),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
    ]))
    story.append(t_info)
    story.append(Spacer(1, 30))
    
    story.append(Paragraph("Executive Overview", style_h2))
    story.append(Paragraph(description, style_body))
    
    story.append(PageBreak())
    
    # --- Page 2: MODULES & ACTORS ---
    reqs = data.get("requirements")
    if reqs:
        story.append(Paragraph("System Scope & Actors", style_h2))
        story.append(Paragraph("The following modules and user personas outline the structural boundaries of the platform.", style_body))
        
        # Modules Table
        modules_list = reqs.get("modules", [])
        if modules_list:
            story.append(Paragraph("Extracted Modules", style_h2))
            mod_data = [[Paragraph("Module Name", style_header_cell), Paragraph("Functional Description", style_header_cell)]]
            for m in modules_list:
                mod_data.append([
                    Paragraph(m.get("name", ""), style_body_white),
                    Paragraph(m.get("desc", ""), style_body)
                ])
            t_mod = Table(mod_data, colWidths=[150, 380])
            t_mod.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), navy_card),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('PADDING', (0,0), (-1,-1), 8),
                ('BOX', (0,0), (-1,-1), 1, border_color),
                ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
            ]))
            story.append(t_mod)
            story.append(Spacer(1, 15))
            
        # Actors Table
        actors_list = reqs.get("actors", [])
        if actors_list:
            story.append(Paragraph("User Personas & Actors", style_h2))
            act_data = [[Paragraph("Actor Profile", style_header_cell), Paragraph("Description & Permissions", style_header_cell)]]
            for a in actors_list:
                act_data.append([
                    Paragraph(a.get("name", ""), style_body_white),
                    Paragraph(a.get("desc", ""), style_body)
                ])
            t_act = Table(act_data, colWidths=[150, 380])
            t_act.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), navy_card),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('PADDING', (0,0), (-1,-1), 8),
                ('BOX', (0,0), (-1,-1), 1, border_color),
                ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
            ]))
            story.append(t_act)
            
        story.append(PageBreak())
        
        # --- Page 3: REQUIREMENTS CHECKLIST ---
        story.append(Paragraph("System Requirements Specifications", style_h2))
        
        # Functional Requirements
        func_list = reqs.get("functional", [])
        if func_list:
            story.append(Paragraph("Functional Requirements", style_h2))
            req_data = [[Paragraph("ID", style_header_cell), Paragraph("Requirement Title", style_header_cell), Paragraph("Detail Specs", style_header_cell)]]
            for r in func_list:
                req_data.append([
                    Paragraph(r.get("id", ""), style_body_white),
                    Paragraph(r.get("title", ""), style_body_white),
                    Paragraph(r.get("desc", ""), style_body)
                ])
            t_req = Table(req_data, colWidths=[60, 140, 330])
            t_req.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), navy_card),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('PADDING', (0,0), (-1,-1), 8),
                ('BOX', (0,0), (-1,-1), 1, border_color),
                ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
            ]))
            story.append(t_req)
            story.append(Spacer(1, 15))
            
        # Non-Functional Requirements
        nfunc_list = reqs.get("non_functional", [])
        if nfunc_list:
            story.append(Paragraph("Non-Functional Requirements & Constraints", style_h2))
            nreq_data = [[Paragraph("ID", style_header_cell), Paragraph("Title", style_header_cell), Paragraph("Metric Constraints", style_header_cell)]]
            for r in nfunc_list + reqs.get("constraints", []):
                nreq_data.append([
                    Paragraph(r.get("id", ""), style_body_white),
                    Paragraph(r.get("title", ""), style_body_white),
                    Paragraph(r.get("desc", ""), style_body)
                ])
            t_nreq = Table(nreq_data, colWidths=[60, 140, 330])
            t_nreq.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), navy_card),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('PADDING', (0,0), (-1,-1), 8),
                ('BOX', (0,0), (-1,-1), 1, border_color),
                ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
            ]))
            story.append(t_nreq)
            
        story.append(PageBreak())

    # --- Page 4: CODE HEALTH & SECURITY LEDGER ---
    sec_issues = data.get("security_issues")
    if sec_issues is not None:
        story.append(Paragraph("Security Vulnerability Scan Ledger", style_h2))
        story.append(Paragraph(f"Brahma code audit gates calculated an overall health score parameter of {health_score}/100.", style_body))
        
        if sec_issues:
            sec_data = [[Paragraph("File Path", style_header_cell), Paragraph("Line", style_header_cell), Paragraph("Severity", style_header_cell), Paragraph("Rule & Message", style_header_cell)]]
            for f in sec_issues:
                sev = f.get("severity", "Low")
                style_sev = sev_style_map.get(sev, style_sev_low)
                sec_data.append([
                    Paragraph(f.get("file", ""), style_body),
                    Paragraph(str(f.get("line", 1)), style_body_white),
                    Paragraph(sev, style_sev),
                    Paragraph(f"{f.get('rule_id', '')}: {f.get('msg', '')}", style_body)
                ])
            t_sec = Table(sec_data, colWidths=[120, 40, 60, 310])
            t_sec.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), navy_card),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('PADDING', (0,0), (-1,-1), 6),
                ('BOX', (0,0), (-1,-1), 1, border_color),
                ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
            ]))
            story.append(t_sec)
        else:
            story.append(Paragraph("✓ Perfect Clean Run. No vulnerabilities or AST credentials leaks detected.", style_body_white))
            
    # Page decorations callback
    def draw_bg(canvas, document):
        canvas.saveState()
        # Navy dark background color fills page
        canvas.setFillColor(navy_dark)
        canvas.rect(0, 0, letter[0], letter[1], fill=True, stroke=False)
        canvas.restoreState()
        
    doc.build(story, onFirstPage=draw_bg, onLaterPages=draw_bg)
    buffer.seek(0)
    return buffer
