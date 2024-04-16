# get_package_path.py
import importlib, sys


def check_package_installed(package_name):
    try:
        importlib.import_module(package_name)
        return True  # Package is installed
    except ImportError:
        return False  # Package is not installed
    except Exception as e:
        print(f"Error checking package {package_name}: {e}")
        return False  # Handle other exceptions


if __name__ == "__main__":
    package_name = sys.argv[1] if len(sys.argv) > 1 else None
    if check_package_installed(package_name):
        print(f"{package_name} is installed.")
    else:
        print(f"{package_name} is not installed.")
