@echo off
cd backend
call ..\env\Scripts\activate.bat
uvicorn main:app --reload
