CODEBUDDY_SKILLS_DIR := $(HOME)/.codebuddy/skills
WORKBUDDY_SKILLS_DIR := $(HOME)/.workbuddy/skills

SKILLS := $(shell find . -maxdepth 1 -mindepth 1 -type d -not -name '.*' | sed 's|^\./||' | sort)

GREEN  := \033[0;32m
YELLOW := \033[1;33m
NC     := \033[0m

.PHONY: all install install-codebuddy install-workbuddy clean list help

all: install

install: install-codebuddy install-workbuddy
	@echo "$(GREEN)✅ All skills installed!$(NC)"

install-codebuddy:
	@$(MAKE) _do-install DST="$(CODEBUDDY_SKILLS_DIR)"

install-workbuddy:
	@$(MAKE) _do-install DST="$(WORKBUDDY_SKILLS_DIR)"

_do-install:
	@mkdir -p "$(DST)"
	@for d in $(SKILLS); do \
		rm -rf "$(DST)/$$d"; \
		cp -r "$$d" "$(DST)/"; \
		echo "  $(GREEN)✓$(NC) $$d → $(DST)/$$d"; \
	done

clean:
	@echo "$(YELLOW)This will remove ONLY the following skills installed by this repo:$(NC)"
	@for d in $(SKILLS); do echo "  - $$d"; done
	@echo "$(YELLOW)Skills from other projects are NOT affected.$(NC)"
	@echo ""
	@printf "$(YELLOW)Type 'yes' to confirm: $(NC)"; \
	read confirm; \
	if [ "$$confirm" != "yes" ]; then \
		echo "$(YELLOW)Aborted.$(NC)"; \
		exit 0; \
	fi; \
	for d in $(SKILLS); do \
		rm -rf "$(CODEBUDDY_SKILLS_DIR)/$$d" "$(WORKBUDDY_SKILLS_DIR)/$$d"; \
		echo "  removed $$d"; \
	done; \
	echo "$(GREEN)✅ Clean complete$(NC)"

list:
	@echo "$(YELLOW)Available skills:$(NC)"
	@for d in $(SKILLS); do echo "  $(GREEN)✓$(NC) $$d"; done

help:
	@echo "$(YELLOW)Usage: make [target]$(NC)"
	@echo "  $(GREEN)install$(NC)           - Install all skills"
	@echo "  $(GREEN)clean$(NC)             - Remove all installed skills"
	@echo "  $(GREEN)list$(NC)              - List available skills"
