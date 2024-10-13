# Variables
NODE_ENV := production
GIT_REPO := patroltech.online_zq4g9bsaqhd@srv07.ingenierosweb.co:~/git/app.git
DIST_DIR := dist

## Ensure we use CMD shell
SHELL := cmd.exe


up:
	@docker compose -f etc/docker/docker-compose.yaml up -d

.PHONY: deploy

deploy:
	@echo Building the application...
	npm run build

	@echo Preparing temporary Git repository for dist...
	if exist temp_dist rmdir /s /q temp_dist
	mkdir temp_dist
	cd temp_dist && git init
	cd temp_dist && git config user.email "deploy@example.com"
	cd temp_dist && git config user.name "Deploy Script"
	cd temp_dist && git remote add origin $(GIT_REPO)

	@echo Copying dist folder to temporary repository...
	xcopy /E /I $(DIST_DIR)\browser temp_dist

	@echo Committing and pushing dist folder...
	cd temp_dist && git add .
	cd temp_dist && git commit -m "Publish version"
	cd temp_dist && git push -u origin master --force

	@echo Cleaning up...
	rmdir /s /q temp_dist

	@echo Build and push of dist folder completed successfully.
