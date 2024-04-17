import importlib, sys, subprocess


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
    process = subprocess.Popen(['pip', 'install', package_name], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    process.wait()

if __name__ == "__main__":
    print(is_package_installed("kivymd"))
