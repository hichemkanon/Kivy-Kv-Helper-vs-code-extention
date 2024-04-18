from checkpackage import is_package_installed, install_package


if not is_package_installed("kivy"):
        print("kivy not found, starts installing...")
        install_package("kivy")
        if is_package_installed("kivy"):
            print("kivy installed with success !")
        else:
            print("failed installing kivy !!")
            
if not is_package_installed("watchdog"):
        print("watchdog not found, starts installing...")
        install_package("watchdog")
        if is_package_installed("watchdog"):
            print("watchdog installed with success !")
        else:
            print("failed installing watchdog !!")


from sys import argv
from kivy.lang import Builder
from kivy.app import App
from kivy.core.window import Window
from kivy.clock import Clock, mainthread
from kivy.uix.label import Label

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from os.path import dirname, basename, join
from kivy.metrics import dp



if len(argv) != 2:
    print('usage: %s filename.kv' % argv[0])
    exit(1)


PATH = dirname(argv[1])
TARGET = basename(argv[1])


class KvHandler(FileSystemEventHandler):
    def __init__(self, callback, target, **kwargs):
        super(KvHandler, self).__init__(**kwargs)
        self.callback = callback
        self.target = target

    def on_any_event(self, event):
        if basename(event.src_path) == self.target:
            self.callback()


class KvViewerApp(App):
    def build(self):
        o = Observer()
        o.schedule(KvHandler(self.update, TARGET), PATH)
        o.start()
        Clock.schedule_once(self.update, 1)
        return super(KvViewerApp, self).build()

    @mainthread
    def update(self, *args):
        Builder.unload_file(join(PATH, TARGET))
        for w in Window.children[:]:
            Window.remove_widget(w)
        try:
            Window.add_widget(Builder.load_file(join(PATH, TARGET)))
        except Exception as e:
            Window.add_widget(Label(font_size=dp(16), padding=dp(13),halign="left", valign="middle", text_size=[Window.width, Window.height], text=self.formatted_message(e.message if getattr(e, r'message', None) else str(e)), markup=True))

    def formatted_message(self, message):
        formated = ""
        for line in message.split("\n"):
            if (line.strip().startswith(">>")):
                line = f"[color=#ff4a3d]{line}[/color]"
            formated += f"{line}\n"
        return formated
    


        

if __name__ == '__main__':
    KvViewerApp().run()