"""
Python TUI template using Rich console.
Demonstrates header, table, tree, status bar, and keyboard-driven flow.
"""

from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.layout import Layout
from rich.text import Text
from rich.tree import Tree
from rich.live import Live
from rich.prompt import Prompt, Confirm
import time

# /* THEME: replace colors with domain palette */
class Theme:
    primary = "cyan"
    accent = "magenta"
    success = "green"
    error = "red"
    muted = "dim white"
    bg = "grey11"
    border = "grey50"
    heading = "bold cyan"
    row_even = "grey15"
    row_odd = "grey19"


console = Console()


def render_header(title: str = "my-tool") -> Panel:
    """/* THEME: replace title and subtitle with domain branding */"""
    heading = Text(title, style=Theme.heading, justify="center")
    return Panel(
        heading,
        subtitle="v1.0.0",
        border_style=Theme.border,
        padding=(1, 2),
    )


def render_table(items: list[dict]) -> Table:
    """Styled data table with alternating row colors."""
    # /* THEME: replace column names and styles */
    table = Table(
        title="Items",
        border_style=Theme.border,
        header_style=f"bold {Theme.primary}",
        show_lines=False,
        pad_edge=True,
    )
    table.add_column("#", style=Theme.muted, width=4)
    table.add_column("Name", style="bold")
    table.add_column("Status", justify="center")
    table.add_column("Updated", style=Theme.muted, justify="right")

    for i, item in enumerate(items):
        row_style = Theme.row_even if i % 2 == 0 else Theme.row_odd
        status_style = Theme.success if item["status"] == "active" else Theme.error
        table.add_row(
            str(i + 1),
            item["name"],
            Text(item["status"], style=status_style),
            item["updated"],
            style=row_style,
        )
    return table


def render_tree() -> Tree:
    """Project structure as a tree view."""
    # /* THEME: replace tree content with domain structure */
    tree = Tree("[bold]project/[/bold]", guide_style=Theme.border)
    src = tree.add("src/")
    src.add("main.py")
    src.add("utils.py")
    tree.add("tests/")
    tree.add("pyproject.toml", style=Theme.muted)
    return tree


def render_footer(message: str = "Ready") -> Panel:
    status = Text(f" {message} ", style=f"on {Theme.bg}")
    keys = Text(" [q]uit  [r]efresh  [/]search ", style=Theme.muted)
    footer_text = Text.assemble(status, "  ", keys)
    return Panel(footer_text, border_style=Theme.border, height=3)


def build_layout(items: list[dict]) -> Layout:
    """Responsive layout: header, body (table + sidebar), footer."""
    layout = Layout()
    layout.split_column(
        Layout(render_header(), name="header", size=5),
        Layout(name="body", ratio=1),
        Layout(render_footer(), name="footer", size=3),
    )
    layout["body"].split_row(
        Layout(render_table(items), name="main", ratio=3),
        Layout(Panel(render_tree(), title="Structure", border_style=Theme.border), ratio=1),
    )
    return layout


def main():
    sample_items = [
        {"name": "Widget Alpha", "status": "active", "updated": "2026-02-28"},
        {"name": "Widget Beta", "status": "inactive", "updated": "2026-02-25"},
        {"name": "Widget Gamma", "status": "active", "updated": "2026-03-01"},
        {"name": "Widget Delta", "status": "active", "updated": "2026-02-20"},
    ]

    console.print(build_layout(sample_items))

    # Interactive prompt flow
    action = Prompt.ask(
        f"[{Theme.primary}]Select action[/]",
        choices=["view", "create", "delete", "quit"],
        default="view",
    )

    if action == "quit":
        console.print(f"[{Theme.muted}]Bye.[/]")
        return

    if Confirm.ask(f"[{Theme.primary}]Proceed with '{action}'?[/]"):
        console.print(f"[{Theme.success}]Done.[/]")
    else:
        console.print(f"[{Theme.error}]Cancelled.[/]")


if __name__ == "__main__":
    main()
