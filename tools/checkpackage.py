import importlib, sys, subprocess, platform


def is_package_installed(package_name):
    try:
        importlib.import_module(package_name)
        return True  # Package is installed
    except ImportError:
        return False  # Package is not installed
    except Exception as e:
        print(f"Error checking package {package_name}: {e}")
        return False  # Handle other exceptions

def install_package(package_name):
    if platform.system().lower() == "linux":
        print("Enter your password to install kivy using sudo apt")
        process = subprocess.Popen(['sudo apt install', f'python3-{package_name}'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        process.wait()
    elif platform.system().lower() == "windows":
        process = subprocess.Popen(['pip', 'install', package_name], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        process.wait()
    elif platform.system().lower() == "darwin":
        process = subprocess.Popen(['pip3', 'install', package_name], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        process.wait()
    else:
        process = subprocess.Popen(['pip', 'install', package_name], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        process.wait()


if __name__ == "__main__":
    print("Hello")
