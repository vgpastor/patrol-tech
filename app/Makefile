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

		@echo Getting the latest commit ID from the main repository...
		for /f %%i in ('git rev-parse HEAD') do set COMMIT_ID=%%i

#		@echo Creating and pushing a new tag in the main repository...
#		for /f %%i in ('date /T') do set DATE=%%i
#		for /f %%i in ('time /T') do set TIME=%%i
#		set TAG_NAME=deploy-%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%-%TIME::=-%
#		git tag -a %TAG_NAME% -m "Deployment on %DATE% at %TIME% for commit %COMMIT_ID%"
#		git push origin %TAG_NAME%

		@echo Preparing temporary Git repository for dist...
		if exist temp_dist rmdir /s /q temp_dist
		mkdir temp_dist
		cd temp_dist && git init
		cd temp_dist && git config user.email "deploy@patroltech.online"
		cd temp_dist && git config user.name "Deploy Script"
		cd temp_dist && git remote add origin $(GIT_REPO)

		@echo Pulling existing content from remote repository...
		cd temp_dist && git fetch --all
		cd temp_dist && git checkout master || git checkout -b master
		cd temp_dist && git pull origin master

		@echo Removing all existing content (except .git directory)...
		cd temp_dist && del /q *
		cd temp_dist && for /d %%x in (*) do @if not "%%x"==".git" rd /s /q "%%x"

		@echo Copying new dist folder content to temporary repository...
		xcopy /E /I /Y $(DIST_DIR)\browser temp_dist

		@echo Committing and pushing dist folder...
		cd temp_dist && git add -A
		cd temp_dist && git commit -m "Publish version for commit %COMMIT_ID%"
		cd temp_dist && git push origin master

		@echo Cleaning up...
		rmdir /s /q temp_dist

		@echo Build and push of dist folder completed successfully.
