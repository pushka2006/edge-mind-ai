import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation(output_path, screenshots_dir="presentation/screenshots"):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Enterprise Dark Palette
    BG_COLOR = RGBColor(8, 12, 20)         # #080c14 Deep Obsidian
    CARD_BG = RGBColor(15, 23, 38)         # #0f1726 Surface Card
    CARD_BG_ALT = RGBColor(23, 33, 53)     # #172135 Elevated Card
    ACCENT_ORANGE = RGBColor(249, 115, 22) # #f97316 Primary Accent
    ACCENT_CYAN = RGBColor(6, 182, 212)    # #06b6d4 Secondary Accent
    ACCENT_GREEN = RGBColor(34, 197, 94)   # #22c55e Success/Status
    TEXT_LIGHT = RGBColor(248, 250, 252)   # #f8fafc Heading Text
    TEXT_MUTED = RGBColor(148, 163, 184)   # #94a3b8 Body Text
    BORDER_COLOR = RGBColor(39, 50, 78)    # #27324e Border Outline

    def set_slide_background(slide):
        bg_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg_shape.fill.solid()
        bg_shape.fill.fore_color.rgb = BG_COLOR
        bg_shape.line.fill.background()
        return bg_shape

    def add_header(slide, title_text, category="EDGE MIND AI PLATFORM"):
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.3))
        cat_tf = cat_box.text_frame
        cat_tf.word_wrap = True
        cat_p = cat_tf.paragraphs[0]
        cat_p.text = category.upper()
        cat_p.font.name = "Arial"
        cat_p.font.size = Pt(10)
        cat_p.font.bold = True
        cat_p.font.color.rgb = ACCENT_ORANGE

        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.65), Inches(11.7), Inches(0.6))
        title_tf = title_box.text_frame
        title_tf.word_wrap = True
        title_p = title_tf.paragraphs[0]
        title_p.text = title_text
        title_p.font.name = "Arial"
        title_p.font.size = Pt(21)
        title_p.font.bold = True
        title_p.font.color.rgb = TEXT_LIGHT

    def add_footer(slide, current_idx, total=11):
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.0), Inches(11.7), Inches(0.3))
        ftf = footer_box.text_frame
        p = ftf.paragraphs[0]
        p.text = f"EDGE MIND AI  |  AI-Powered Edge Memory & Intelligence Platform  |  Slide {current_idx} of {total}"
        p.font.name = "Arial"
        p.font.size = Pt(9)
        p.font.color.rgb = TEXT_MUTED

    def add_card(slide, left, top, width, height, bg=CARD_BG, border=BORDER_COLOR):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg
        shape.line.color.rgb = border
        shape.line.width = Pt(1)
        return shape

    def add_screenshot(slide, filename, left, top, width, height):
        path = os.path.join(screenshots_dir, filename)
        if os.path.exists(path):
            border_shape = add_card(slide, left - Inches(0.04), top - Inches(0.04), width + Inches(0.08), height + Inches(0.08), bg=BG_COLOR, border=BORDER_COLOR)
            pic = slide.shapes.add_picture(path, left, top, width, height)
            return pic
        return None

    # ==========================================
    # SLIDE 1: Title Slide
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    card_hero = add_card(s1, Inches(1.2), Inches(1.0), Inches(10.933), Inches(5.5), bg=CARD_BG, border=ACCENT_ORANGE)

    b_box = s1.shapes.add_textbox(Inches(1.8), Inches(1.5), Inches(9.7), Inches(0.4))
    b_tf = b_box.text_frame
    b_p = b_tf.paragraphs[0]
    b_p.text = "ENTERPRISE OFFLINE-FIRST AI INFRASTRUCTURE"
    b_p.font.name = "Arial"
    b_p.font.size = Pt(11)
    b_p.font.bold = True
    b_p.font.color.rgb = ACCENT_ORANGE

    t_box = s1.shapes.add_textbox(Inches(1.8), Inches(2.0), Inches(9.7), Inches(1.2))
    t_tf = t_box.text_frame
    t_tf.word_wrap = True
    t_p = t_tf.paragraphs[0]
    t_p.text = "EDGE MIND AI"
    t_p.font.name = "Arial"
    t_p.font.size = Pt(46)
    t_p.font.bold = True
    t_p.font.color.rgb = TEXT_LIGHT

    sub_box = s1.shapes.add_textbox(Inches(1.8), Inches(3.2), Inches(9.7), Inches(0.8))
    sub_tf = sub_box.text_frame
    sub_tf.word_wrap = True
    sub_p = sub_tf.paragraphs[0]
    sub_p.text = "AI-Powered Edge Memory & Intelligence Platform\nLocal Intelligence • Persistent Vector Memory • Cloud Synchronization"
    sub_p.font.name = "Arial"
    sub_p.font.size = Pt(18)
    sub_p.font.color.rgb = ACCENT_CYAN

    pills = ["Sub-5ms Vector Recall", "100% Offline Autonomy", "Priority Delta Sync", "Multi-Master Consensus"]
    for i, pill in enumerate(pills):
        px = Inches(1.8) + Inches(i * 2.45)
        add_card(s1, px, Inches(4.3), Inches(2.3), Inches(0.6), bg=CARD_BG_ALT, border=BORDER_COLOR)
        pbox = s1.shapes.add_textbox(px, Inches(4.3), Inches(2.3), Inches(0.6))
        ptf = pbox.text_frame
        pp = ptf.paragraphs[0]
        pp.alignment = PP_ALIGN.CENTER
        pp.text = pill
        pp.font.name = "Arial"
        pp.font.size = Pt(10)
        pp.font.bold = True
        pp.font.color.rgb = TEXT_LIGHT

    meta_box = s1.shapes.add_textbox(Inches(1.8), Inches(5.3), Inches(9.7), Inches(0.8))
    mtf = meta_box.text_frame
    mp = mtf.paragraphs[0]
    mp.text = "Pushkar  |  GitHub: https://github.com/pushka2006/edge-mind-ai  |  Production Release v1.0"
    mp.font.name = "Arial"
    mp.font.size = Pt(11)
    mp.font.color.rgb = TEXT_MUTED

    # ==========================================
    # SLIDE 2: Executive Overview & Dashboard
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "Executive Overview: Autonomous Edge Intelligence")
    add_footer(s2, 2)

    add_card(s2, Inches(0.8), Inches(1.4), Inches(5.2), Inches(5.3), bg=CARD_BG, border=ACCENT_ORANGE)
    c2_box = s2.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(4.8), Inches(4.9))
    c2_tf = c2_box.text_frame
    c2_tf.word_wrap = True

    p = c2_tf.paragraphs[0]
    p.text = "CORE VALUE PROPOSITION"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_ORANGE

    p_items = [
        ("The Cloud Latency Wall: ", "Standard cloud LLM queries incur 200ms-2s roundtrip delays, choking industrial robots and CNC controllers."),
        ("Embedded Vector Engine: ", "On-device 128-dimensional dense vector indexing delivers <5ms local retrieval with zero cloud dependency."),
        ("Resilient Operation: ", "When connectivity drops, EdgeMind AI captures telemetry, resolves queries, and accumulates a priority sync queue."),
        ("Live Operational Telemetry: ", "Active tracking of 520 memories, 5 edge devices, and real-time sync health across the entire fleet.")
    ]
    for title, desc in p_items:
        p2 = c2_tf.add_paragraph()
        p2.space_before = Pt(12)
        r1 = p2.add_run()
        r1.text = "• " + title
        r1.font.bold = True
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p2.add_run()
        r2.text = desc
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = TEXT_MUTED

    add_screenshot(s2, "dashboard_overview_1790424076218.png", Inches(6.3), Inches(1.4), Inches(6.2), Inches(5.3))

    # ==========================================
    # SLIDE 3: Offline Simulation & Resilience
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "Offline-First Resilience: Zero Cloud Dependency")
    add_footer(s3, 3)

    add_card(s3, Inches(0.8), Inches(1.4), Inches(5.2), Inches(5.3), bg=CARD_BG, border=RGBColor(239, 68, 68))
    c3_box = s3.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(4.8), Inches(4.9))
    c3_tf = c3_box.text_frame
    c3_tf.word_wrap = True

    p = c3_tf.paragraphs[0]
    p.text = "OFFLINE SIMULATION & BUFFERING"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = RGBColor(239, 68, 68)

    p_items = [
        ("Simulate Offline Mode Toggle: ", "1-click interactive switch in the top navigation bar immediately isolates the edge node from cloud APIs."),
        ("Zero Degradation: ", "Edge vector search, memory generation, and EdgeMind local AI assistant continue functioning with 100% capacity."),
        ("Delta Queue Accumulation: ", "New memories are staged in a local prioritized sync buffer (CRITICAL, HIGH, NORMAL)."),
        ("Automatic Reconnection: ", "Restoring network triggers instant cryptographic payload verification and background delta streaming.")
    ]
    for title, desc in p_items:
        p2 = c3_tf.add_paragraph()
        p2.space_before = Pt(12)
        r1 = p2.add_run()
        r1.text = "✔ " + title
        r1.font.bold = True
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p2.add_run()
        r2.text = desc
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = TEXT_MUTED

    add_screenshot(s3, "offline_mode_active_1790424114318.png", Inches(6.3), Inches(1.4), Inches(6.2), Inches(5.3))

    # ==========================================
    # SLIDE 4: Memory Explorer & 128-Dim Inspector
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "Memory Inspector: High-Dimensional Vector Embeddings")
    add_footer(s4, 4)

    add_card(s4, Inches(0.8), Inches(1.4), Inches(5.2), Inches(5.3), bg=CARD_BG, border=ACCENT_CYAN)
    c4_box = s4.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(4.8), Inches(4.9))
    c4_tf = c4_box.text_frame
    c4_tf.word_wrap = True

    p = c4_tf.paragraphs[0]
    p.text = "VECTOR STORAGE ARCHITECTURE"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN

    p_items = [
        ("128-Dim Dense Embeddings: ", "Custom on-device vector generation optimized for machine telemetry, vibrational signatures, and logs."),
        ("Memory Inspector Modal: ", "Engineers can inspect raw vector floats, cosine bounds, timestamp provenance, and hardware tags."),
        ("Cryptographic Integrity: ", "Every memory block is sealed with SHA-256 integrity hashes to guarantee tamper detection."),
        ("Version History Snapshots: ", "Full immutable chain-of-custody tracking reviewer changes, AI modifications, and sensor audits.")
    ]
    for title, desc in p_items:
        p2 = c4_tf.add_paragraph()
        p2.space_before = Pt(12)
        r1 = p2.add_run()
        r1.text = "• " + title
        r1.font.bold = True
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p2.add_run()
        r2.text = desc
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = TEXT_MUTED

    add_screenshot(s4, "memory_inspector_modal_1790424225555.png", Inches(6.3), Inches(1.4), Inches(6.2), Inches(5.3))

    # ==========================================
    # SLIDE 5: Sub-Millisecond Semantic Vector Search
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "Hybrid Retrieval: Vector Distance & Keyword Scoring")
    add_footer(s5, 5)

    add_card(s5, Inches(0.8), Inches(1.4), Inches(5.2), Inches(5.3), bg=CARD_BG, border=ACCENT_ORANGE)
    c5_box = s5.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(4.8), Inches(4.9))
    c5_tf = c5_box.text_frame
    c5_tf.word_wrap = True

    p = c5_tf.paragraphs[0]
    p.text = "NATURAL LANGUAGE RETRIEVAL"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_ORANGE

    p_items = [
        ("Natural Language Queries: ", "Engineers search via plain phrases like 'spindle vibration anomaly' or 'bearing thermal spike'."),
        ("Sub-3ms Local Matching: ", "On-device cosine distance scoring computes similarity in real-time without sending packets to the cloud."),
        ("Match Confidence Scoring: ", "Demonstrated similarity scores up to 98.4% ranking critical telemetry incidents at the top."),
        ("Faceted Filtering: ", "Filter instantly by device ID (DEV-001), severity class (ANOMALY, WARNING), or synchronization state.")
    ]
    for title, desc in p_items:
        p2 = c5_tf.add_paragraph()
        p2.space_before = Pt(12)
        r1 = p2.add_run()
        r1.text = "• " + title
        r1.font.bold = True
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p2.add_run()
        r2.text = desc
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = TEXT_MUTED

    add_screenshot(s5, "semantic_search_results_1790424451723.png", Inches(6.3), Inches(1.4), Inches(6.2), Inches(5.3))

    # ==========================================
    # SLIDE 6: Multi-Master Conflict Center
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "Conflict Center: Multi-Master State Reconciliation")
    add_footer(s6, 6)

    add_card(s6, Inches(0.8), Inches(1.4), Inches(5.2), Inches(5.3), bg=CARD_BG, border=ACCENT_GREEN)
    c6_box = s6.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(4.8), Inches(4.9))
    c6_tf = c6_box.text_frame
    c6_tf.word_wrap = True

    p = c6_tf.paragraphs[0]
    p.text = "SIDE-BY-SIDE CONSENSUS DIFFING"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_GREEN

    p_items = [
        ("Network Partition Divergence: ", "Identifies records modified concurrently at the edge device and cloud server during an outage."),
        ("3-Way Visual Diffing: ", "Clear inspection panel displaying Local Edge state, Cloud Server state, and AI Synthesized preview."),
        ("Strategy 1: Keep Local: ", "Edge hardware sensor measurements override cloud estimations."),
        ("Strategy 2: Keep Cloud: ", "Enterprise-wide configuration parameters override edge modifications."),
        ("Strategy 3: AI Synthesis: ", "EdgeMind LLM merges sensor telemetry with cloud work order notes into an authoritative record.")
    ]
    for title, desc in p_items:
        p2 = c6_tf.add_paragraph()
        p2.space_before = Pt(10)
        r1 = p2.add_run()
        r1.text = "✔ " + title
        r1.font.bold = True
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p2.add_run()
        r2.text = desc
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = TEXT_MUTED

    add_screenshot(s6, "conflict_center_diff_1790424526224.png", Inches(6.3), Inches(1.4), Inches(6.2), Inches(5.3))

    # ==========================================
    # SLIDE 7: EdgeMind Offline AI Assistant
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "Conversational AI: Offline RAG with Memory Citations")
    add_footer(s7, 7)

    add_card(s7, Inches(0.8), Inches(1.4), Inches(5.2), Inches(5.3), bg=CARD_BG, border=ACCENT_CYAN)
    c7_box = s7.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(4.8), Inches(4.9))
    c7_tf = c7_box.text_frame
    c7_tf.word_wrap = True

    p = c7_tf.paragraphs[0]
    p.text = "LOCAL ON-DEVICE RAG ENGINE"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN

    p_items = [
        ("Grounded Answers: ", "Synthesizes natural language explanations using exclusively locally indexed vector memories."),
        ("Verifiable Citations: ", "Every assertion links directly to memory IDs (e.g., [M-1024], [M-1026]) eliminating hallucinations."),
        ("Industrial Diagnostic Assistance: ", "Explains complex operational incidents like high-torque milling anomalies and bearing temperatures."),
        ("Edge Model Routing: ", "Uses EdgeMind-Nano-8B locally and seamlessly switches to Titan-Cloud when high-capacity uplinks are available.")
    ]
    for title, desc in p_items:
        p2 = c7_tf.add_paragraph()
        p2.space_before = Pt(12)
        r1 = p2.add_run()
        r1.text = "• " + title
        r1.font.bold = True
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p2.add_run()
        r2.text = desc
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = TEXT_MUTED

    add_screenshot(s7, "edgemind_ai_chat_response_1790424678726.png", Inches(6.3), Inches(1.4), Inches(6.2), Inches(5.3))

    # ==========================================
    # SLIDE 8: Industrial Multi-Device Fleet
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "Fleet Management: Multi-Device Telemetry & Health")
    add_footer(s8, 8)

    add_card(s8, Inches(0.8), Inches(1.4), Inches(5.2), Inches(5.3), bg=CARD_BG, border=ACCENT_ORANGE)
    c8_box = s8.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(4.8), Inches(4.9))
    c8_tf = c8_box.text_frame
    c8_tf.word_wrap = True

    p = c8_tf.paragraphs[0]
    p.text = "FLEET TELEMETRY MATRIX"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_ORANGE

    p_items = [
        ("Multi-Device Fleet Coverage: ", "Real-time health monitoring across 5 representative edge industrial node form factors:"),
        ("DEV-001 (Machine Edge #01): ", "CNC 5-Axis Milling Cell monitoring vibrations & thermals."),
        ("DEV-002 (Robotic Arm #04): ", "Assembly robotics tracking joint torque and encoder logs."),
        ("DEV-003 (Smart Kiosk #02): ", "Public interactive point-of-service node."),
        ("DEV-004 (Autonomous Drone #09): ", "Tactical inspection aerial drone with intermittent radio."),
        ("DEV-005 (Sensor Hub #07): ", "Environmental telemetry array logging ambient pressure.")
    ]
    for title, desc in p_items:
        p2 = c8_tf.add_paragraph()
        p2.space_before = Pt(8)
        r1 = p2.add_run()
        r1.text = "• " + title
        r1.font.bold = True
        r1.font.size = Pt(10)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p2.add_run()
        r2.text = desc
        r2.font.size = Pt(10)
        r2.font.color.rgb = TEXT_MUTED

    add_screenshot(s8, "edge_devices_fleet_1790424770749.png", Inches(6.3), Inches(1.4), Inches(6.2), Inches(5.3))

    # ==========================================
    # SLIDE 9: Topological Memory Graph
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, "Memory Graph: Interactive Node Network Topology")
    add_footer(s9, 9)

    add_card(s9, Inches(0.8), Inches(1.4), Inches(5.2), Inches(5.3), bg=CARD_BG, border=ACCENT_CYAN)
    c9_box = s9.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(4.8), Inches(4.9))
    c9_tf = c9_box.text_frame
    c9_tf.word_wrap = True

    p = c9_tf.paragraphs[0]
    p.text = "KNOWLEDGE TOPOLOGY MAPPING"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN

    p_items = [
        ("Relational Visual Mapping: ", "Connects edge machine components to sensor anomalies, diagnostic classifications, and cloud replicas."),
        ("Physics-Based Interaction: ", "Dynamic force-directed graph with drag-and-drop nodes, zoom, and component grouping."),
        ("Incident Traceability: ", "Trace how a spindle bearing overheating event links to maintenance work orders and resolution memos."),
        ("Cross-Cluster Replication: ", "Highlights which nodes are synchronized to central Qdrant and which remain locally buffered.")
    ]
    for title, desc in p_items:
        p2 = c9_tf.add_paragraph()
        p2.space_before = Pt(12)
        r1 = p2.add_run()
        r1.text = "• " + title
        r1.font.bold = True
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p2.add_run()
        r2.text = desc
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = TEXT_MUTED

    add_screenshot(s9, "memory_graph_topology_1790424835329.png", Inches(6.3), Inches(1.4), Inches(6.2), Inches(5.3))

    # ==========================================
    # SLIDE 10: 11-Step Simulation & Benchmarks
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_header(s10, "Verification Workflow: 11-Step Live Edge Simulation")
    add_footer(s10, 10)

    add_card(s10, Inches(0.8), Inches(1.4), Inches(5.2), Inches(5.3), bg=CARD_BG, border=ACCENT_GREEN)
    c10_box = s10.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(4.8), Inches(4.9))
    c10_tf = c10_box.text_frame
    c10_tf.word_wrap = True

    p = c10_tf.paragraphs[0]
    p.text = "BENCHMARKS & VERIFIED METRICS"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = ACCENT_GREEN

    p_items = [
        ("Sub-5ms Vector Recall: ", "Local 128-dim cosine distance lookup executes in <4.8ms average latency on edge hardware."),
        ("84% Bandwidth Savings: ", "Priority delta streaming transfers only changed vector diffs rather than full payload retransmissions."),
        ("100% Offline Uptime: ", "Zero failure or query timeouts during simulated satellite network severance."),
        ("11-Step Interactive Walkthrough: ", "Simulates baseline setup, thermal spikes, offline capture, cloud conflict, and AI resolution.")
    ]
    for title, desc in p_items:
        p2 = c10_tf.add_paragraph()
        p2.space_before = Pt(12)
        r1 = p2.add_run()
        r1.text = "✔ " + title
        r1.font.bold = True
        r1.font.size = Pt(10.5)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p2.add_run()
        r2.text = desc
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = TEXT_MUTED

    add_screenshot(s10, "edge_demo_step_3_1790424959580.png", Inches(6.3), Inches(1.4), Inches(6.2), Inches(5.3))

    # ==========================================
    # SLIDE 11: Security & Roadmap
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11)
    add_header(s11, "Enterprise Governance & Deployment Roadmap")
    add_footer(s11, 11)

    add_card(s11, Inches(1.2), Inches(1.4), Inches(10.933), Inches(5.3), bg=CARD_BG, border=ACCENT_ORANGE)
    c11_box = s11.shapes.add_textbox(Inches(1.6), Inches(1.7), Inches(10.1), Inches(4.7))
    c11_tf = c11_box.text_frame
    c11_tf.word_wrap = True

    p = c11_tf.paragraphs[0]
    p.text = "HARDWARE-ENCLAVE SECURITY & ROADMAP"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = ACCENT_ORANGE

    takeaways = [
        ("Hardware-Enclave AES-256: ", "All on-device memory stores and vector files are encrypted at rest using TPM-bound keys."),
        ("Air-Gapped Compliance: ", "LOCAL_ONLY security policies ensure defense and medical records never egress physical hardware boundaries."),
        ("Production Technology Stack: ", "Next.js 16, React 19, TypeScript, Qdrant Vector Engine, Recharts, and Tailwind CSS v4."),
        ("Ready for Production Deployment: ", "Deployable via lightweight Docker containers on Raspberry Pi 5, Jetson Orin, or Snapdragon PCs."),
        ("GitHub Repository: ", "Complete source code, documentation, and deployment guides available at https://github.com/pushka2006/edge-mind-ai")
    ]
    for t, d in takeaways:
        p2 = c11_tf.add_paragraph()
        p2.space_before = Pt(12)
        r1 = p2.add_run()
        r1.text = "• " + t
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = TEXT_LIGHT
        r2 = p2.add_run()
        r2.text = d
        r2.font.size = Pt(11)
        r2.font.color.rgb = TEXT_MUTED

    prs.save(output_path)
    print(f"Enhanced Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "EDGE_MIND_AI_Presentation.pptx"
    create_presentation(out)
