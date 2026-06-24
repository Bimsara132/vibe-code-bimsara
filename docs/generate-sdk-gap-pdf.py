#!/usr/bin/env python3
"""Generate docs/custom-ui-vs-sdk.pdf from gap analysis content."""

from fpdf import FPDF
from pathlib import Path

OUT = Path(__file__).parent / "custom-ui-vs-sdk.pdf"


class GapPDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("Helvetica", "I", 8)
            self.set_text_color(120, 120, 120)
            self.cell(0, 8, "vibe.ibl.ai - Custom UI vs SDK", align="R")
            self.ln(4)

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(140, 140, 140)
        self.cell(0, 8, f"Page {self.page_no()}", align="C")

    def section_title(self, title: str):
        self.ln(4)
        self.set_font("Helvetica", "B", 13)
        self.set_text_color(17, 17, 17)
        self.cell(0, 9, title, new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(114, 132, 255)
        self.set_line_width(0.6)
        y = self.get_y()
        self.line(10, y, 200, y)
        self.ln(4)

    def body_text(self, text: str):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(40, 40, 40)
        self.multi_cell(0, 5, text)
        self.ln(2)

    def table(self, headers, rows, col_widths):
        self.set_font("Helvetica", "B", 8.5)
        self.set_fill_color(114, 132, 255)
        self.set_text_color(255, 255, 255)
        for i, h in enumerate(headers):
            self.cell(col_widths[i], 7, h, border=1, fill=True)
        self.ln()

        self.set_font("Helvetica", "", 8)
        fill = False
        for row in rows:
            if self.get_y() > 265:
                self.add_page()
                self.set_font("Helvetica", "B", 8.5)
                self.set_fill_color(114, 132, 255)
                self.set_text_color(255, 255, 255)
                for i, h in enumerate(headers):
                    self.cell(col_widths[i], 7, h, border=1, fill=True)
                self.ln()
                self.set_font("Helvetica", "", 8)

            max_h = 7
            cell_lines = []
            for i, cell in enumerate(row):
                lines = self.multi_cell(col_widths[i], 5, str(cell), split_only=True)
                cell_lines.append(lines)
                max_h = max(max_h, len(lines) * 5)

            if fill:
                self.set_fill_color(250, 250, 250)
            else:
                self.set_fill_color(255, 255, 255)
            self.set_text_color(30, 30, 30)

            x0, y0 = self.get_x(), self.get_y()
            x = x0
            for i, lines in enumerate(cell_lines):
                self.set_xy(x, y0)
                self.multi_cell(
                    col_widths[i],
                    5,
                    "\n".join(lines),
                    border=1,
                    fill=True,
                    max_line_height=self.font_size,
                )
                x += col_widths[i]
            self.set_xy(x0, y0 + max_h)
            fill = not fill
        self.ln(4)


def main():
    pdf = GapPDF()
    pdf.set_auto_page_break(auto=True, margin=14)
    pdf.add_page()

    pdf.set_font("Helvetica", "B", 20)
    pdf.set_text_color(17, 17, 17)
    pdf.cell(0, 12, "vibe.ibl.ai - Custom UI vs SDK", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(85, 85, 85)
    pdf.cell(0, 6, "What we built vs what the ibl.ai SDK provides  |  June 2026", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    pdf.set_fill_color(244, 246, 255)
    pdf.set_draw_color(199, 210, 254)
    pdf.set_font("Helvetica", "", 9.5)
    pdf.set_text_color(30, 30, 30)
    box = (
        "In one sentence: We built a Lovable-style app shell (sidebar, home, projects, resources). "
        "The SDK powers chat, auth, projects API, and profile - but many shell features are still custom or mock.\n\n"
        "SDK packages: @iblai/iblai-js 1.18  |  web-containers 1.9  |  data-layer 1.8  |  web-utils 1.10"
    )
    pdf.multi_cell(0, 5, box, border=1, fill=True)
    pdf.ln(6)

    pdf.section_title("1. Every screen - who builds what?")
    pdf.table(
        ["Screen", "URL", "Custom UI", "SDK provides", "Status"],
        [
            ["Home", "/app", "Welcome hero, prompt box, suggestions", "Mentor discovery, memory API", "Partial"],
            ["Chat", "/app?session=", "Custom prompt footer, canvas CSS", "Chat - messages, canvas, voice", "SDK wired"],
            ["Projects list", "/app/projects", "Grid/list, filters, Create btn", "Projects API - CRUD", "SDK wired"],
            ["Project chat", "/app/projects/:id", "Route wrapper only", "Chat + projectId landing", "SDK wired"],
            ["Resources", "/app/resources", "Template gallery (static)", "No template API", "Mock"],
            ["Connectors", "Sidebar overlay", "Marketing panel, fake list", "ConnectorManagementDialog", "Mock"],
            ["Sidebar", "Always visible", "Nav, recents, notifications", "AppSidebar (not used)", "Partial"],
            ["Profile", "/app/profile", "Dialog wrapper", "UserProfileModal", "SDK wired"],
            ["Login", "/login", "Custom login design", "Auth providers, SSO", "Partial"],
            ["Admin", "/app/admin", "30+ menu items", "Agent admin tabs exist", "Mock nav only"],
        ],
        [22, 28, 48, 48, 24],
    )

    pdf.add_page()
    pdf.section_title("2. What we NEED from the SDK (not wired yet)")
    pdf.body_text("These SDK features exist but our app still uses custom or fake UI instead.")
    pdf.table(
        ["SDK feature", "What it does", "What we do today", "Priority"],
        [
            ["AppSidebar", "Projects dropdown, pinned chats, recents", "Custom 1,470-line sidebar + localStorage", "P0"],
            ["Chat history API", "Server-backed conversation list", "localStorage only - breaks on new device", "P0"],
            ["UserProfileDropdown", "Profile menu + tenant switcher", "Custom dropdown + demo notifications", "P0"],
            ["File upload", "Attach files to chat messages", "Drop zone shows toast only", "P0"],
            ["NotificationDropdown", "Real notification bell + center", "Hardcoded fake notifications", "P1"],
            ["ConnectorManagementDialog", "Real MCP / connector setup", "Static mock connectors panel", "P1"],
            ["ConversationStarters", "SDK welcome prompts per agent", "Static PromptSuggestions on home", "P1"],
            ["AgentSearch", "Browse / pick agents", "Single default agent from env", "P2"],
            ["Account page", "Org settings, billing", "Profile modal only", "P2"],
            ["Agent admin tabs", "LLM, MCP, datasets, safety, etc.", "Admin nav with no routes", "P2"],
            ["CreditBalance", "Usage / credits widget", "Not shown", "P3"],
            ["AnalyticsLayout", "Usage dashboards", "Not shown", "P3"],
        ],
        [38, 52, 52, 18],
    )

    pdf.section_title("3. What the SDK already gives us (wired today)")
    pdf.table(
        ["SDK piece", "Used for", "File in our app"],
        [
            ["Chat component", "Messages, streaming, canvas, voice", "vibe-build-chat.tsx"],
            ["AuthProvider + TenantProvider", "Login session, tenant, tokens", "iblai-providers.tsx"],
            ["useGetUserProjectsQuery", "List projects", "projects-context.tsx"],
            ["useCreate/Update/DeleteUserProject", "Create project -> open chat", "projects-context.tsx"],
            ["useGetUserProjectDetailsQuery", "Load project agents", "vibe-build-chat.tsx"],
            ["useGetMentorsQuery", "Pick default agent", "use-default-mentor.ts"],
            ["UserProfileModal", "Profile settings dialog", "profile-dialog.tsx"],
            ["Memory APIs", "Memory popover in prompt", "memory-popover.tsx"],
            ["useMentorTools (Canvas)", "Enable canvas per session", "vibe-build-chat.tsx"],
            ["Redux chat slices", "Session ID, streaming state", "iblai-store.ts"],
        ],
        [48, 62, 50],
    )

    pdf.add_page()
    pdf.section_title("4. What stays CUSTOM (SDK does not provide)")
    pdf.table(
        ["Feature", "Why it stays custom", "Decision"],
        [
            ["Lovable-style home hero", "Branded landing - not in SDK", "Keep custom"],
            ["Custom prompt footer", "Our look; SDK input hidden via CSS", "Keep custom"],
            ["Resources / templates gallery", "Marketing page - no SDK equivalent", "Keep or remove mock"],
            ["Connectors marketing overlay", "Product marketing", "Replace with SDK dialog later"],
            ["Projects grid/list views", "SDK has sidebar list, not this layout", "Keep custom UI"],
            ["Pending-build URL flow (?new=)", "App-specific: auto-send first message", "Keep custom"],
            ["Canvas split CSS overrides", "SDK layout tweaks for our shell", "Keep custom"],
        ],
        [48, 72, 40],
    )

    pdf.section_title("5. Real vs mock - quick checklist")
    pdf.table(
        ["Feature", "Real data?", "Source"],
        [
            ["Login / SSO", "Yes", "SDK auth"],
            ["Chat messages", "Yes", "SDK Chat + WebSocket"],
            ["Canvas / voice", "Yes", "SDK Chat"],
            ["Projects list & create", "Yes", "data-layer API"],
            ["Project chat (files, instructions)", "Yes", "SDK ProjectLandingPage"],
            ["Profile settings", "Yes", "SDK UserProfileModal"],
            ["Memory in prompt", "Yes", "data-layer API"],
            ["Sidebar recent chats", "Local only", "localStorage"],
            ["Starred projects", "Local only", "localStorage"],
            ["Home prompt suggestions", "No", "Static array"],
            ["Resources templates", "No", "Static CDN images"],
            ["Connectors panel", "No", "Hardcoded list"],
            ["Notifications in sidebar", "No", "Demo data"],
            ["Admin console pages", "No", "Nav only, no routes"],
            ["File attach on prompt", "No", "Toast only"],
        ],
        [80, 35, 45],
    )

    pdf.section_title("6. Recommended next steps")
    pdf.table(
        ["#", "Action", "SDK piece to add", "Effort"],
        [
            ["1", "Replace localStorage recents with server history", "Chat history API / AppSidebar", "Medium"],
            ["2", "Swap custom profile menu for SDK dropdown", "UserProfileDropdown", "Low"],
            ["3", "Wire project card rename/delete menu", "Existing mutations", "Low"],
            ["4", "Connect file drop to real upload", "files reducer + SDK upload", "Medium"],
            ["5", "Replace mock connectors with real management", "ConnectorManagementDialog", "Medium"],
            ["6", "Add real notifications", "NotificationDropdown", "Low"],
            ["7", "Add admin routes or remove dead nav", "Agent admin tabs", "High"],
        ],
        [10, 62, 58, 20],
    )

    pdf.ln(6)
    pdf.set_font("Helvetica", "I", 8)
    pdf.set_text_color(140, 140, 140)
    pdf.multi_cell(
        0,
        4,
        "Generated for vibe.ibl.ai  |  Source: docs/custom-ui-vs-sdk.md  |  ibl.ai skills in .agents/skills/",
    )

    pdf.output(str(OUT))
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
