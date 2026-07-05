# Makefile for installing skills to CodeBuddy and WorkBuddy
#
# Directory structure:
#   ./keyword_finder/SKILL.md          → top-level skill
#   ./engineering/tdd/SKILL.md         → nested skill (engineering is a category, not a skill)
#   ./engineering/README.md            → category README, ignored

# Directories - per CodeBuddy skill-creator docs:
#   User skills: ~/.codebuddy/skills/
#   Project skills: .codebuddy/skills/
CODEBUDDY_SKILLS_DIR := $(HOME)/.codebuddy/skills
WORKBUDDY_SKILLS_DIR := $(HOME)/.workbuddy/skills
SKILLS_DIR := .

# Auto-discover all skills: any directory containing SKILL.md
#   level 1:  ./keyword_finder            → skill name: keyword_finder
#   level 2:  ./engineering/tdd           → skill name: tdd
SKILLS := $(shell find $(SKILLS_DIR) -maxdepth 3 -name SKILL.md \
	| sed 's|./||;s|/SKILL\.md||' \
	| sort)

# Colors for output
GREEN  := \033[0;32m
YELLOW := \033[1;33m
RED    := \033[0;31m
NC     := \033[0m

.PHONY: all install install-codebuddy install-workbuddy clean list check-dirs help

all: install

# ── Install ──────────────────────────────────────────

install: install-codebuddy install-workbuddy
	@echo "$(GREEN)✅ All skills installed successfully!$(NC)"
	@echo ""
	@echo "$(YELLOW)Next: restart CodeBuddy/WorkBuddy to load new skills.$(NC)"

# Install skills to CodeBuddy
install-codebuddy: check-dirs
	@echo "$(YELLOW)Installing skills to CodeBuddy...$(NC)"
	@mkdir -p "$(CODEBUDDY_SKILLS_DIR)"
	@for skill_path in $(SKILLS); do \
		skill_name=$$(echo $$skill_path | sed 's|.*/||'); \
		src="$(SKILLS_DIR)/$$skill_path"; \
		dst="$(CODEBUDDY_SKILLS_DIR)/$$skill_name"; \
		echo "  Installing $$skill_name..."; \
		rm -rf "$$dst"; \
		cp -r "$$src" "$$dst"; \
		echo "  $(GREEN)✓$(NC) $$skill_name → $$dst"; \
	done
	@echo "$(GREEN)✅ CodeBuddy installation complete$(NC)"

# Install skills to WorkBuddy
install-workbuddy: check-dirs
	@echo "$(YELLOW)Installing skills to WorkBuddy...$(NC)"
	@mkdir -p "$(WORKBUDDY_SKILLS_DIR)"
	@for skill_path in $(SKILLS); do \
		skill_name=$$(echo $$skill_path | sed 's|.*/||'); \
		src="$(SKILLS_DIR)/$$skill_path"; \
		dst="$(WORKBUDDY_SKILLS_DIR)/$$skill_name"; \
		echo "  Installing $$skill_name..."; \
		rm -rf "$$dst"; \
		cp -r "$$src" "$$dst"; \
		echo "  $(GREEN)✓$(NC) $$skill_name → $$dst"; \
	done
	@echo "$(GREEN)✅ WorkBuddy installation complete$(NC)"

# ── Install a specific skill ─────────────────────────

# Supports both forms:
#   make install-keyword_finder          (top-level skill)
#   make install-tdd                     (nested skill, name only)
#   make install-engineering/tdd         (nested skill, full path)
install-%:
	@target=$(*); \
	src=""; \
	skill_name=""; \
	\
	# 1) Try as full path (e.g. engineering/tdd) \
	if [ -f "$(SKILLS_DIR)/$$target/SKILL.md" ]; then \
		src="$(SKILLS_DIR)/$$target"; \
		skill_name=$$(echo "$$target" | sed 's|.*/||'); \
	# 2) Try as top-level skill name \
	elif [ -f "$(SKILLS_DIR)/$$target/SKILL.md" ]; then \
		src="$(SKILLS_DIR)/$$target"; \
		skill_name="$$target"; \
	else \
		# 3) Search in all category dirs for the name \
		for cat_dir in $$(find $(SKILLS_DIR) -mindepth 1 -maxdepth 1 -type d ! -name '.*' | sed 's|./||'); do \
			if [ -f "$(SKILLS_DIR)/$$cat_dir/$$target/SKILL.md" ]; then \
				src="$(SKILLS_DIR)/$$cat_dir/$$target"; \
				skill_name="$$target"; \
				break; \
			fi; \
		done; \
	fi; \
	\
	if [ -n "$$src" ] && [ -d "$$src" ]; then \
		echo "$(YELLOW)Installing $$skill_name...$(NC)"; \
		mkdir -p "$(CODEBUDDY_SKILLS_DIR)"; \
		rm -rf "$(CODEBUDDY_SKILLS_DIR)/$$skill_name"; \
		cp -r "$$src" "$(CODEBUDDY_SKILLS_DIR)/"; \
		echo "  $(GREEN)✓$(NC) $$skill_name → $(CODEBUDDY_SKILLS_DIR)/$$skill_name"; \
		mkdir -p "$(WORKBUDDY_SKILLS_DIR)"; \
		rm -rf "$(WORKBUDDY_SKILLS_DIR)/$$skill_name"; \
		cp -r "$$src" "$(WORKBUDDY_SKILLS_DIR)/"; \
		echo "  $(GREEN)✓$(NC) $$skill_name → $(WORKBUDDY_SKILLS_DIR)/$$skill_name"; \
		echo "$(GREEN)✅ $$skill_name installed successfully!$(NC)"; \
	else \
		echo "$(RED)✗ Skill not found: $(*)$(NC)"; \
		echo "  Run 'make list' to see available skills."; \
	fi

# ── Clean ────────────────────────────────────────────

clean:
	@echo "$(YELLOW)Cleaning installed skills...$(NC)"
	@for skill_path in $(SKILLS); do \
		skill_name=$$(echo $$skill_path | sed 's|.*/||'); \
		echo "  Removing $$skill_name..."; \
		rm -rf "$(CODEBUDDY_SKILLS_DIR)/$$skill_name" 2>/dev/null || true; \
		rm -rf "$(WORKBUDDY_SKILLS_DIR)/$$skill_name" 2>/dev/null || true; \
	done
	@echo "$(GREEN)✅ Clean complete$(NC)"

# ── List ─────────────────────────────────────────────

list:
	@echo "$(YELLOW)Available skills:$(NC)"
	@for skill_path in $(SKILLS); do \
		category=$$(echo $$skill_path | sed 's|/.*||'); \
		skill_name=$$(echo $$skill_path | sed 's|.*/||'); \
		if [ "$$category" = "$$skill_name" ]; then \
			echo "  $(GREEN)✓$(NC) $$skill_name"; \
		else \
			echo "  $(GREEN)✓$(NC) $$category/$$skill_name"; \
		fi; \
	done
	@echo ""
	@echo "$(YELLOW)Installation targets:$(NC)"
	@echo "  CodeBuddy: $(CODEBUDDY_SKILLS_DIR)"
	@echo "  WorkBuddy: $(WORKBUDDY_SKILLS_DIR)"
	@echo ""
	@echo "$(YELLOW)Currently installed skills:$(NC)"
	@for skill_path in $(SKILLS); do \
		skill_name=$$(echo $$skill_path | sed 's|.*/||'); \
		cb=$$([ -d "$(CODEBUDDY_SKILLS_DIR)/$$skill_name" ] && echo "$(GREEN)✓$(NC)" || echo "$(NC)- "); \
		wb=$$([ -d "$(WORKBUDDY_SKILLS_DIR)/$$skill_name" ] && echo "$(GREEN)✓$(NC)" || echo "$(NC)- "); \
		echo "  $$cb CodeBuddy: $$skill_name"; \
		echo "  $$wb WorkBuddy: $$skill_name"; \
	done

# ── Helpers ──────────────────────────────────────────

check-dirs:
	@mkdir -p "$(CODEBUDDY_SKILLS_DIR)"
	@mkdir -p "$(WORKBUDDY_SKILLS_DIR)"

help:
	@echo "$(YELLOW)Usage: make [target]$(NC)"
	@echo ""
	@echo "$(YELLOW)Targets:$(NC)"
	@echo "  $(GREEN)install$(NC)               - Install all skills to CodeBuddy and WorkBuddy"
	@echo "  $(GREEN)install-codebuddy$(NC)     - Install skills to CodeBuddy only"
	@echo "  $(GREEN)install-workbuddy$(NC)     - Install skills to WorkBuddy only"
	@echo "  $(GREEN)install-<name>$(NC)        - Install a specific skill"
	@echo "                          e.g. make install-keyword_finder"
	@echo "                          e.g. make install-tdd        (nested skill)"
	@echo "                          e.g. make install-engineering/tdd"
	@echo "  $(GREEN)clean$(NC)                 - Remove all installed skills"
	@echo "  $(GREEN)list$(NC)                  - List available and installed skills"
	@echo "  $(GREEN)help$(NC)                  - Show this help message"
	@echo ""
	@echo "$(YELLOW)Auto-discovered skills ($(words $(SKILLS)) total):$(NC)"
	@for skill_path in $(SKILLS); do \
		category=$$(echo $$skill_path | sed 's|/.*||'); \
		skill_name=$$(echo $$skill_path | sed 's|.*/||'); \
		if [ "$$category" = "$$skill_name" ]; then \
			echo "  - $$skill_name"; \
		else \
			echo "  - $$category/$$skill_name"; \
		fi; \
	done
	@echo ""
	@echo "$(YELLOW)Install locations:$(NC)"
	@echo "  CodeBuddy (user): $(CODEBUDDY_SKILLS_DIR)"
	@echo "  WorkBuddy:        $(WORKBUDDY_SKILLS_DIR)"
