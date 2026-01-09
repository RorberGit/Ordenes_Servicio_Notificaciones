# 📘 Git Cheatsheet Básico

## 🔹 Inicializar y clonar repositorios
- `git init` → Inicializa un repositorio en la carpeta actual  
- `git clone URL` → Clona un repositorio desde GitHub  

## 🔹 Ver y manejar remotes
- `git remote -v` → Ver los remotes configurados  
- `git remote add NOMBRE URL` → Añadir un nuevo remote  
- `git remote remove NOMBRE` → Eliminar un remote  
- `git remote set-url origin URL` → Cambiar la URL de un remote existente  

## 🔹 Trabajar con ramas
- `git branch` → Lista todas las ramas locales  
- `git branch -r` → Lista ramas remotas  
- `git checkout main` → Cambiar a la rama main  
- `git checkout -b nueva-rama` → Crear y cambiar a una rama nueva  
- `git branch -d nombre-rama` → Borrar una rama local  

## 🔹 Guardar y subir cambios
- `git status` → Ver qué archivos han cambiado  
- `git add .` → Añadir todos los cambios  
- `git add archivo` → Añadir un archivo específico  
- `git add frontend/` → Añadir solo los cambios en la carpeta frontend  
- `git commit -m "mensaje"` → Guardar los cambios en la rama local  
- `git push -u origin rama` → Subir rama nueva a GitHub  
- `git push` → Subir commits a la rama ya enlazada  

## 🔹 Sincronizar con remotes
- `git fetch upstream` → Traer ramas y commits del remoto (sin mezclar)  
- `git pull origin main` → Traer y mezclar cambios desde origin/main  
- `git pull upstream main` → Traer y mezclar cambios desde upstream/main  
- `git push origin main` → Subir cambios a origin/main  

## 🔹 Otros útiles
- `git log --oneline --graph --decorate` → Ver historial resumido con ramas  
- `git diff` → Ver diferencias antes de hacer commit  
- `git stash` → Guardar cambios temporalmente  
- `git stash pop` → Recuperar cambios guardados con stash  
