# Install backend deps
pip install -r backend/requirements.txt

# Install frontend deps
cd frontend
npm install
cd ..
# Format repository with Prettier
npx prettier -w .

