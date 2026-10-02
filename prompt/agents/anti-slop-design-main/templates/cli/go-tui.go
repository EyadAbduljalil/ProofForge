// Go TUI template using Bubble Tea, Lip Gloss, and Bubbles.
// List view with selectable items, spinner, styled borders.
package main

import (
	"fmt"
	"os"

	"github.com/charmbracelet/bubbles/list"
	"github.com/charmbracelet/bubbles/spinner"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

/* THEME: replace colors with domain palette */
var (
	colorPrimary = lipgloss.Color("#22d3ee") // cyan-400
	colorAccent  = lipgloss.Color("#c084fc") // purple-400
	colorSuccess = lipgloss.Color("#4ade80") // green-400
	colorError   = lipgloss.Color("#f87171") // red-400
	colorMuted   = lipgloss.Color("#6b7280") // gray-500
	colorBg      = lipgloss.Color("#1e1e2e") // surface
)

/* THEME: replace styles to match domain visual language */
var (
	appStyle = lipgloss.NewStyle().
			Padding(1, 2).
			Background(colorBg)

	titleStyle = lipgloss.NewStyle().
			Foreground(colorPrimary).
			Bold(true).
			BorderStyle(lipgloss.RoundedBorder()).
			BorderForeground(colorMuted).
			Padding(0, 2)

	itemStyle = lipgloss.NewStyle().
			PaddingLeft(2)

	selectedStyle = lipgloss.NewStyle().
			Foreground(colorAccent).
			Bold(true).
			PaddingLeft(1).
			SetString("▸ ")

	statusStyle = lipgloss.NewStyle().
			Foreground(colorMuted).
			Italic(true)
)

// --- Model ---

type state int

const (
	stateList state = iota
	stateLoading
	stateDone
)

type item struct {
	title string
	desc  string
}

func (i item) Title() string       { return i.title }
func (i item) Description() string { return i.desc }
func (i item) FilterValue() string { return i.title }

type model struct {
	state    state
	list     list.Model
	spinner  spinner.Model
	selected string
	err      error
}

func initialModel() model {
	/* THEME: replace list items with domain data */
	items := []list.Item{
		item{title: "Deploy service", desc: "Push latest build to production"},
		item{title: "Run migrations", desc: "Apply pending database changes"},
		item{title: "View logs", desc: "Tail the application log stream"},
		item{title: "Check health", desc: "Ping all service endpoints"},
	}

	delegate := list.NewDefaultDelegate()
	delegate.Styles.SelectedTitle = delegate.Styles.SelectedTitle.
		Foreground(colorAccent).Bold(true)
	delegate.Styles.SelectedDesc = delegate.Styles.SelectedDesc.
		Foreground(colorMuted)

	l := list.New(items, delegate, 40, 12)
	l.Title = "Actions"
	l.Styles.Title = titleStyle
	l.SetShowHelp(true)
	l.SetFilteringEnabled(true)

	s := spinner.New()
	s.Spinner = spinner.Dot
	s.Style = lipgloss.NewStyle().Foreground(colorAccent)

	return model{state: stateList, list: l, spinner: s}
}

// --- Update ---

type doneMsg struct{}

func (m model) Init() tea.Cmd {
	return nil
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "q", "ctrl+c":
			return m, tea.Quit
		case "enter":
			if m.state == stateList {
				if i, ok := m.list.SelectedItem().(item); ok {
					m.selected = i.title
					m.state = stateLoading
					return m, tea.Batch(m.spinner.Tick, tea.Tick(
						tea.Second*2, func(_ interface{}) tea.Msg { return doneMsg{} },
					))
				}
			}
			if m.state == stateDone {
				return m, tea.Quit
			}
		}
	case spinner.TickMsg:
		if m.state == stateLoading {
			var cmd tea.Cmd
			m.spinner, cmd = m.spinner.Update(msg)
			return m, cmd
		}
	case doneMsg:
		m.state = stateDone
		return m, nil
	case tea.WindowSizeMsg:
		m.list.SetSize(msg.Width-4, msg.Height-4)
	}

	if m.state == stateList {
		var cmd tea.Cmd
		m.list, cmd = m.list.Update(msg)
		return m, cmd
	}
	return m, nil
}

// --- View ---

func (m model) View() string {
	switch m.state {
	case stateLoading:
		return appStyle.Render(
			fmt.Sprintf("%s Running: %s\n\n%s",
				m.spinner.View(),
				lipgloss.NewStyle().Foreground(colorPrimary).Render(m.selected),
				statusStyle.Render("press q to cancel"),
			),
		)
	case stateDone:
		check := lipgloss.NewStyle().Foreground(colorSuccess).Render("✓")
		return appStyle.Render(
			fmt.Sprintf("%s %s complete\n\n%s",
				check,
				m.selected,
				statusStyle.Render("press enter to exit"),
			),
		)
	default:
		return appStyle.Render(m.list.View())
	}
}

func main() {
	p := tea.NewProgram(initialModel(), tea.WithAltScreen())
	if _, err := p.Run(); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}
