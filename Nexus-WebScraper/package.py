import subprocess
import sys

# List of required modules

# Do these commands first!!
# sudo apt update
# sudo apt install python3 python3-pip



modules = [
    'argparse', 'requests', 'time', 'enum34', 'datetime',
    'selenium', 'urllib3', 'pathlib', 'flask', 'flask-cors'
]

# Function to install a module
def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

# Install each module
for module in modules:
    try:
        __import__(module)  # Try importing the module to see if it's already installed
        print(f"Module '{module}' is already installed.")
    except ImportError:
        print(f"Module '{module}' not found. Installing...")
        install(module)

print("All required modules are installed.")