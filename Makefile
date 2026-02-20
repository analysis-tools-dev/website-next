.PHONY: install
install: ## Install dependencies
	npm install

.PHONY: dev
dev: ## Run development server
	npm run dev

.PHONY: build
build: ## Build for production
	npm run build

.PHONY: docker-build
docker-build: ## Build docker image with GCP credentials secret
	@test -n "$(GOOGLE_APPLICATION_CREDENTIALS)" || (echo "GOOGLE_APPLICATION_CREDENTIALS must be set"; exit 1)
	DOCKER_BUILDKIT=1 docker build --secret id=gcp_creds,src=$(GOOGLE_APPLICATION_CREDENTIALS) -t analysis-tools-dev .


.PHONY: start
start: ## Start Node server
	npm run start

.PHONY: clean
clean: ## Clean build
	rm -rf .next

