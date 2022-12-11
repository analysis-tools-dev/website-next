.PHONY: install
install: ## Install dependencies
	npm install

.PHONY: dev
dev: ## Run development server
	npm run dev

.PHONY: build
build: ## Build for production
	npm run build
