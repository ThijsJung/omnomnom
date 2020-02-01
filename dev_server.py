from http.server import SimpleHTTPRequestHandler, HTTPServer
import ssl
import logging

class GetHandler(SimpleHTTPRequestHandler):

        def do_GET(self):
            SimpleHTTPRequestHandler.do_GET(self)

        def do_POST(self):
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.data_string = self.rfile.read(int(self.headers['Content-Length']))
            print(self.data_string)

            data = b"<script>window.location.replace('create_recipe.html');</script>"
            data = b"<body>watskeburt?</body>"
            # self.wfile.write(data)
            # return

Handler=GetHandler

logging.basicConfig(level=logging.DEBUG)
httpd=HTTPServer(("localhost", 8080), Handler)
httpd.serve_forever()