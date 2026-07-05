# Makefile for installing skills to CodeBuddy and WorkBuddy

# Directories - per CodeBuddy skill-creator docs:
#   User skills: ~/.codebuddy/skills/
#   Project skills: .codebuddy/skills/
CODEBUDDY_SKILLS_DIR := $(HOME)/.codebuddy/skills
WORKBUDDY_SKILLS_DIR := $(HOME)/.workbuddy/skills
SKILLS_DIR := .

# Skills to install
SKILLS := seo_customer_acquisition keyword_finder

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

.PHONY: all install install-codebuddy install-workbuddy clean list check-dirs help

all: install

# Install all skills to both CodeBuddy and WorkBuddy
install: install-codebuddy install-workbuddy
	@echo "$(GREEN)✅ All skills installed successfully!$(NC)"
	@echo ""
	@echo "$(YELLOW)Next: restart CodeBuddy/WorkBuddy to load new skills.$(NC)"

# Install skills to CodeBuddy
install-codebuddy: check-dirs
	@echo "$(YELLOW)Installing skills to CodeBuddy...$(NC)"
	@mkdir -p "$(CODEBUDDY_SKILLS_DIR)"
	@for skill in $(SKILLS); do \
		if [ -d "$(SKILLS_DIR)/$$skill" ]; then \
			echo "  Installing $$skill..."; \
			rm -rf "$(CODEBUDDY_SKILLS_DIR)/$$skill"; \
			cp -r "$(SKILLS_DIR)/$$skill" "$(CODEBUDDY_SKILLS_DIR)/"; \
			echo "  $(GREEN)✓$(NC) $$skill → $(CODEBUDDY_SKILLS_DIR)/$$skill"; \
		else \
			echo "  $(RED)✗$(NC) Skill directory $$skill not found"; \
		fi \
	done
	@echo "$(GREEN)✅ CodeBuddy installation complete$(NC)"

# Install skills to WorkBuddy
install-workbuddy: check-dirs
	@echo "$(YELLOW)Installing skills to WorkBuddy...$(NC)"
	@mkdir -p "$(WORKBUDDY_SKILLS_DIR)"
	@for skill in $(SKILLS); do \
		if [ -d "$(SKILLS_DIR)/$$skill" ]; then \
			echo "  Installing $$skill..."; \
			rm -rf "$(WORKBUDDY_SKILLS_DIR)/$$skill"; \
			cp -r "$(SKILLS_DIR)/$$skill" "$(WORKBUDDY_SKILLS_DIR)/"; \
			echo "  $(GREEN)✓$(NC) $$skill → $(WORKBUDDY_SKILLS_DIR)/$$skill"; \
		else \
			echo "  $(RED)✗$(NC) Skill directory $$skill not found"; \
		fi \
	done
	@echo "$(GREEN)✅ WorkBuddy installation complete$(NC)"

# Install a specific skill
install-%:
	@skill=$*; \
	if [ -d "$(SKILLS_DIR)/$$skill" ]; then \
		echo "$(YELLOW)Installing $$skill...$(NC)"; \
		mkdir -p "$(CODEBUDDY_SKILLS_DIR)"; \
		rm -rf "$(CODEBUDDY_SKILLS_DIR)/$$skill"; \
		cp -r "$(SKILLS_DIR)/$$skill" "$(CODEBUDDY_SKILLS_DIR)/"; \
		echo "  $(GREEN)✓$(NC) $$skill → $(CODEBUDDY_SKILLS_DIR)/$$skill"; \
		mkdir -p "$(WORKBUDDY_SKILLS_DIR)"; \
		rm -rf "$(WORKBUDDY_SKILLS_DIR)/$$skill"; \
		cp -r "$(SKILLS_DIR)/$$skill" "$(WORKBUDDY_SKILLS_DIR)/"; \
		echo "  $(GREEN)✓$(NC) $$skill → $(WORKBUDDY_SKILLS_DIR)/$$skill"; \
		echo "$(GREEN)✅ $$skill installed successfully!$(NC)"; \
	else \
		echo "$(RED)✗ Skill directory $$skill not found$(NC)"; \
		echo "Available skills: $(SKILLS)"; \
	fi

# Clean installed skills
clean:
	@echo "$(YELLOW)Cleaning installed skills...$(NC)"
	@for skill in $(SKILLS); do \
		echo "  Removing $$skill from CodeBuddy..."; \
		rm -rf "$(CODEBUDDY_SKILLS_DIR)/$$skill" 2>/dev/null || true; \
		echo "  Removing $$skill from WorkBuddy..."; \
		rm -rf "$(WORKBUDDY_SKILLS_DIR)/$$skill" 2>/dev/null || true; \
	done
	@echo "$(GREEN)✅ Clean complete$(NC)"

# List available skills
list:
	@echo "$(YELLOW)Available skills:$(NC)"
	@for skill in $(SKILLS); do \
		if [ -d "$(SKILLS_DIR)/$$skill" ]; then \
			echo "  $(GREEN)✓$(NC) $$skill"; \
		else \
			echo "  $(RED)✗$(NC) $$skill (not found)"; \
		fi \
	done
	@echo ""
	@echo "$(YELLOW)Installation targets:$(NC)"
	@echo "  CodeBuddy: $(CODEBUDDY_SKILLS_DIR)"
	@echo "  WorkBuddy: $(WORKBUDDY_SKILLS_DIR)"
	@echo ""
	@echo "$(YELLOW)Currently installed skills:$(NC)"
	@for skill in $(SKILLS); do \
		if [ -d "$(CODEBUDDY_SKILLS_DIR)/$$skill" ]; then \
			echo "  $(GREEN)✓$(NC) CodeBuddy: $$skill"; \
		else \
			echo "  $(NC)-  CodeBuddy: $$skill (not installed)"; \
		fi; \
		if [ -d "$(WORKBUDDY_SKILLS_DIR)/$$skill" ]; then \
			echo "  $(GREEN)✓$(NC) WorkBuddy: $$skill"; \
		else \
			echo "  $(NC)-  WorkBuddy: $$skill (not installed)"; \
		fi; \
	done

# Check if directories exist, create if needed
check-dirs:
	@mkdir -p "$(CODEBUDDY_SKILLS_DIR)"
	@mkdir -p "$(WORKBUDDY_SKILLS_DIR)"

# Show help
help:
	@echo "$(YELLOW)Usage: make [target]$(NC)"
	@echo ""
	@echo "$(YELLOW)Targets:$(NC)"
	@echo "  $(GREEN)install$(NC)       - Install all skills to CodeBuddy and WorkBuddy"
	@echo "  $(GREEN)install-codebuddy$(NC) - Install skills to CodeBuddy only"
	@echo "  $(GREEN)install-workbuddy$(NC) - Install skills to WorkBuddy only"
	@echo "  $(GREEN)install-<skill>$(NC)   - Install a specific skill (e.g., make install-seo_customer_acquisition)"
	@echo "  $(GREEN)clean$(NC)         - Remove installed skills"
	@echo "  $(GREEN)list$(NC)          - List available and installed skills"
	@echo "  $(GREEN)help$(NC)          - Show this help message"
	@echo ""
	@echo "$(YELLOW)Available skills:$(NC)"
	@for skill in $(SKILLS); do \
		echo "  - $$skill"; \
	done
	@echo ""
	@echo "$(YELLOW)Install locations (per CodeBuddy skill-creator docs):$(NC)"
	@echo "  CodeBuddy (user): $(CODEBUDDY_SKILLS_DIR)"
	@echo "  WorkBuddy:        $(WORKBUDDY_SKILLS_DIR)"