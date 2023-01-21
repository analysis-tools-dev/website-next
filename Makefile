.PHONY: install
install: ## Install dependencies
	npm install

.PHONY: dev
dev: ## Run development server
	npm run dev

.PHONY: build
build: ## Build for production
	npm run build

.PHONY: start
start: ## Start Node server
	npm run start

.PHONY: clean
clean: ## Clean build
	rm -rf .next

