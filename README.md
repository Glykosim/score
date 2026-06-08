# Score

This project is prepared for GitHub Pages.

## Publish

1. Create a new empty repository on GitHub.
2. Add it as the `origin` remote:
   `git remote add origin https://github.com/<your-user>/<repo>.git`
3. Commit the files:
   `git add .`
   `git commit -m "Prepare site for GitHub Pages"`
4. Push:
   `git push -u origin main`
5. In GitHub, open `Settings` -> `Pages`.
6. Under `Build and deployment`, choose `Deploy from a branch`.
7. Select branch `main` and folder `/ (root)`.

Your site will then be available at:

`https://<your-user>.github.io/<repo>/`
