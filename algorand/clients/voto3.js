import { getArc56ReturnValue } from '@algorandfoundation/algokit-utils/types/app-arc56';
import { AppClient as _AppClient, } from '@algorandfoundation/algokit-utils/types/app-client';
import { AppFactory as _AppFactory } from '@algorandfoundation/algokit-utils/types/app-factory';
export const APP_SPEC = { "name": "Voto3", "structs": {}, "methods": [{ "name": "abrir_registro_compromisos", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "cerrar_registro_compromisos", "args": [], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "registrar_compromiso", "args": [], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "abrir_registro_raices", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "cerrar_registro_raices", "args": [], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "registrar_raiz", "args": [], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "abrir_registro_anuladores", "args": [], "returns": { "type": "void" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "cerrar_registro_anuladores", "args": [], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }, { "name": "registrar_anulador", "args": [], "returns": { "type": "uint64" }, "actions": { "create": [], "call": ["NoOp"] }, "readonly": false, "events": [], "recommendations": {} }], "arcs": [22, 28], "networks": {}, "state": { "schema": { "global": { "ints": 9, "bytes": 0 }, "local": { "ints": 0, "bytes": 0 } }, "keys": { "global": { "contador_compromisos": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "Y29udGFkb3JfY29tcHJvbWlzb3M=" }, "contador_raices": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "Y29udGFkb3JfcmFpY2Vz" }, "contador_anuladores": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "Y29udGFkb3JfYW51bGFkb3Jlcw==" }, "registro_compromisos_abierto": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVnaXN0cm9fY29tcHJvbWlzb3NfYWJpZXJ0bw==" }, "registro_compromisos_cerrado": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVnaXN0cm9fY29tcHJvbWlzb3NfY2VycmFkbw==" }, "registro_raices_abierto": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVnaXN0cm9fcmFpY2VzX2FiaWVydG8=" }, "registro_raices_cerrado": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVnaXN0cm9fcmFpY2VzX2NlcnJhZG8=" }, "registro_anuladores_abierto": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVnaXN0cm9fYW51bGFkb3Jlc19hYmllcnRv" }, "registro_anuladores_cerrado": { "keyType": "AVMString", "valueType": "AVMUint64", "key": "cmVnaXN0cm9fYW51bGFkb3Jlc19jZXJyYWRv" } }, "local": {}, "box": {} }, "maps": { "global": {}, "local": {}, "box": {} } }, "bareActions": { "create": ["NoOp"], "call": [] }, "sourceInfo": { "approval": { "sourceInfo": [{ "pc": [710], "errorMessage": "El registro de anuladores no está abierto" }, { "pc": [666, 716], "errorMessage": "El registro de anuladores ya fue cerrado" }, { "pc": [523, 550], "errorMessage": "El registro de compromisos no está abierto" }, { "pc": [580], "errorMessage": "El registro de compromisos no está cerrado" }, { "pc": [506, 529, 556], "errorMessage": "El registro de compromisos ya fue cerrado" }, { "pc": [630], "errorMessage": "El registro de raíces no está abierto" }, { "pc": [603, 660, 683], "errorMessage": "El registro de raíces no está cerrado" }, { "pc": [586, 609, 636, 689], "errorMessage": "El registro de raíces ya fue cerrado" }, { "pc": [349, 366, 383, 395, 412, 429, 441, 458, 475], "errorMessage": "OnCompletion is not NoOp" }, { "pc": [655], "errorMessage": "Solo el creador puede abrir el registro de anuladores" }, { "pc": [500], "errorMessage": "Solo el creador puede abrir el registro de compromisos" }, { "pc": [575], "errorMessage": "Solo el creador puede abrir el registro de raíces" }, { "pc": [677], "errorMessage": "Solo el creador puede cerrar el registro de anuladores" }, { "pc": [517], "errorMessage": "Solo el creador puede cerrar el registro de compromisos" }, { "pc": [597], "errorMessage": "Solo el creador puede cerrar el registro de raíces" }, { "pc": [704], "errorMessage": "Solo el creador puede registrar anuladores" }, { "pc": [544], "errorMessage": "Solo el creador puede registrar compromisos" }, { "pc": [624], "errorMessage": "Solo el creador puede registrar raíces" }, { "pc": [492], "errorMessage": "can only call when creating" }, { "pc": [352, 369, 386, 398, 415, 432, 444, 461, 478], "errorMessage": "can only call when not creating" }, { "pc": [697, 721], "errorMessage": "check self.contador_anuladores exists" }, { "pc": [537, 561], "errorMessage": "check self.contador_compromisos exists" }, { "pc": [617, 641], "errorMessage": "check self.contador_raices exists" }, { "pc": [682, 709], "errorMessage": "check self.registro_anuladores_abierto exists" }, { "pc": [664, 687, 714], "errorMessage": "check self.registro_anuladores_cerrado exists" }, { "pc": [522, 549], "errorMessage": "check self.registro_compromisos_abierto exists" }, { "pc": [504, 527, 554, 579], "errorMessage": "check self.registro_compromisos_cerrado exists" }, { "pc": [602, 629], "errorMessage": "check self.registro_raices_abierto exists" }, { "pc": [584, 607, 634, 659], "errorMessage": "check self.registro_raices_cerrado exists" }], "pcOffsetMethod": "none" }, "clear": { "sourceInfo": [], "pcOffsetMethod": "none" } }, "source": { "approval": "I3ByYWdtYSB2ZXJzaW9uIDEwCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBzbWFydF9jb250cmFjdHMudm90bzMuY29udHJhY3QuVm90bzMuX19hbGdvcHlfZW50cnlwb2ludF93aXRoX2luaXQoKSAtPiB1aW50NjQ6Cm1haW46CiAgICBpbnRjYmxvY2sgMCAxCiAgICBieXRlY2Jsb2NrICJyZWdpc3Ryb19jb21wcm9taXNvc19jZXJyYWRvIiAicmVnaXN0cm9fcmFpY2VzX2NlcnJhZG8iIDB4MTUxZjdjNzUgInJlZ2lzdHJvX2FudWxhZG9yZXNfY2VycmFkbyIgImNvbnRhZG9yX2NvbXByb21pc29zIiAiY29udGFkb3JfcmFpY2VzIiAiY29udGFkb3JfYW51bGFkb3JlcyIgInJlZ2lzdHJvX2NvbXByb21pc29zX2FiaWVydG8iICJyZWdpc3Ryb19yYWljZXNfYWJpZXJ0byIgInJlZ2lzdHJvX2FudWxhZG9yZXNfYWJpZXJ0byIKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBibnogbWFpbl9hZnRlcl9pZl9lbHNlQDIKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy92b3RvMy9jb250cmFjdC5weToyMi0yMwogICAgLy8gIyBJbmljaWFsaXphciBjb250YWRvcmVzCiAgICAvLyBzZWxmLmNvbnRhZG9yX2NvbXByb21pc29zID0gVUludDY0KDApCiAgICBieXRlYyA0IC8vICJjb250YWRvcl9jb21wcm9taXNvcyIKICAgIGludGNfMCAvLyAwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjI0CiAgICAvLyBzZWxmLmNvbnRhZG9yX3JhaWNlcyA9IFVJbnQ2NCgwKQogICAgYnl0ZWMgNSAvLyAiY29udGFkb3JfcmFpY2VzIgogICAgaW50Y18wIC8vIDAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6MjUKICAgIC8vIHNlbGYuY29udGFkb3JfYW51bGFkb3JlcyA9IFVJbnQ2NCgwKQogICAgYnl0ZWMgNiAvLyAiY29udGFkb3JfYW51bGFkb3JlcyIKICAgIGludGNfMCAvLyAwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjI3LTI4CiAgICAvLyAjIEluaWNpYWxpemFyIGVzdGFkb3MgZGUgcmVnaXN0cm8KICAgIC8vIHNlbGYucmVnaXN0cm9fY29tcHJvbWlzb3NfYWJpZXJ0byA9IEZhbHNlCiAgICBieXRlYyA3IC8vICJyZWdpc3Ryb19jb21wcm9taXNvc19hYmllcnRvIgogICAgaW50Y18wIC8vIDAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6MjkKICAgIC8vIHNlbGYucmVnaXN0cm9fY29tcHJvbWlzb3NfY2VycmFkbyA9IEZhbHNlCiAgICBieXRlY18wIC8vICJyZWdpc3Ryb19jb21wcm9taXNvc19jZXJyYWRvIgogICAgaW50Y18wIC8vIDAKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6MzAKICAgIC8vIHNlbGYucmVnaXN0cm9fcmFpY2VzX2FiaWVydG8gPSBGYWxzZQogICAgYnl0ZWMgOCAvLyAicmVnaXN0cm9fcmFpY2VzX2FiaWVydG8iCiAgICBpbnRjXzAgLy8gMAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy92b3RvMy9jb250cmFjdC5weTozMQogICAgLy8gc2VsZi5yZWdpc3Ryb19yYWljZXNfY2VycmFkbyA9IEZhbHNlCiAgICBieXRlY18xIC8vICJyZWdpc3Ryb19yYWljZXNfY2VycmFkbyIKICAgIGludGNfMCAvLyAwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjMyCiAgICAvLyBzZWxmLnJlZ2lzdHJvX2FudWxhZG9yZXNfYWJpZXJ0byA9IEZhbHNlCiAgICBieXRlYyA5IC8vICJyZWdpc3Ryb19hbnVsYWRvcmVzX2FiaWVydG8iCiAgICBpbnRjXzAgLy8gMAogICAgYXBwX2dsb2JhbF9wdXQKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy92b3RvMy9jb250cmFjdC5weTozMwogICAgLy8gc2VsZi5yZWdpc3Ryb19hbnVsYWRvcmVzX2NlcnJhZG8gPSBGYWxzZQogICAgYnl0ZWNfMyAvLyAicmVnaXN0cm9fYW51bGFkb3Jlc19jZXJyYWRvIgogICAgaW50Y18wIC8vIDAKICAgIGFwcF9nbG9iYWxfcHV0CgptYWluX2FmdGVyX2lmX2Vsc2VAMjoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy92b3RvMy9jb250cmFjdC5weTo2CiAgICAvLyBjbGFzcyBWb3RvMyhBUkM0Q29udHJhY3QpOgogICAgdHhuIE51bUFwcEFyZ3MKICAgIGJ6IG1haW5fYmFyZV9yb3V0aW5nQDE0CiAgICBwdXNoYnl0ZXNzIDB4YzdmZTkzYzAgMHg4ODAyOWRkMiAweDEwOWI2YTYxIDB4OWE3ZTc2NTEgMHg2OTRlOTZlMSAweDljMTdhNDMwIDB4NGU4MTJjZjcgMHg4MDA2NzhlYyAweGI5YmRjZWMxIC8vIG1ldGhvZCAiYWJyaXJfcmVnaXN0cm9fY29tcHJvbWlzb3MoKXZvaWQiLCBtZXRob2QgImNlcnJhcl9yZWdpc3Ryb19jb21wcm9taXNvcygpdWludDY0IiwgbWV0aG9kICJyZWdpc3RyYXJfY29tcHJvbWlzbygpdWludDY0IiwgbWV0aG9kICJhYnJpcl9yZWdpc3Ryb19yYWljZXMoKXZvaWQiLCBtZXRob2QgImNlcnJhcl9yZWdpc3Ryb19yYWljZXMoKXVpbnQ2NCIsIG1ldGhvZCAicmVnaXN0cmFyX3JhaXooKXVpbnQ2NCIsIG1ldGhvZCAiYWJyaXJfcmVnaXN0cm9fYW51bGFkb3Jlcygpdm9pZCIsIG1ldGhvZCAiY2VycmFyX3JlZ2lzdHJvX2FudWxhZG9yZXMoKXVpbnQ2NCIsIG1ldGhvZCAicmVnaXN0cmFyX2FudWxhZG9yKCl1aW50NjQiCiAgICB0eG5hIEFwcGxpY2F0aW9uQXJncyAwCiAgICBtYXRjaCBtYWluX2FicmlyX3JlZ2lzdHJvX2NvbXByb21pc29zX3JvdXRlQDUgbWFpbl9jZXJyYXJfcmVnaXN0cm9fY29tcHJvbWlzb3Nfcm91dGVANiBtYWluX3JlZ2lzdHJhcl9jb21wcm9taXNvX3JvdXRlQDcgbWFpbl9hYnJpcl9yZWdpc3Ryb19yYWljZXNfcm91dGVAOCBtYWluX2NlcnJhcl9yZWdpc3Ryb19yYWljZXNfcm91dGVAOSBtYWluX3JlZ2lzdHJhcl9yYWl6X3JvdXRlQDEwIG1haW5fYWJyaXJfcmVnaXN0cm9fYW51bGFkb3Jlc19yb3V0ZUAxMSBtYWluX2NlcnJhcl9yZWdpc3Ryb19hbnVsYWRvcmVzX3JvdXRlQDEyIG1haW5fcmVnaXN0cmFyX2FudWxhZG9yX3JvdXRlQDEzCgptYWluX2FmdGVyX2lmX2Vsc2VAMTY6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6NgogICAgLy8gY2xhc3MgVm90bzMoQVJDNENvbnRyYWN0KToKICAgIGludGNfMCAvLyAwCiAgICByZXR1cm4KCm1haW5fcmVnaXN0cmFyX2FudWxhZG9yX3JvdXRlQDEzOgogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjEwMAogICAgLy8gQGFiaW1ldGhvZCgpCiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIGlzIG5vdCBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYXNzZXJ0IC8vIGNhbiBvbmx5IGNhbGwgd2hlbiBub3QgY3JlYXRpbmcKICAgIGNhbGxzdWIgcmVnaXN0cmFyX2FudWxhZG9yCiAgICBpdG9iCiAgICBieXRlY18yIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgptYWluX2NlcnJhcl9yZWdpc3Ryb19hbnVsYWRvcmVzX3JvdXRlQDEyOgogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjkyCiAgICAvLyBAYWJpbWV0aG9kKCkKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gaXMgbm90IE5vT3AKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBhc3NlcnQgLy8gY2FuIG9ubHkgY2FsbCB3aGVuIG5vdCBjcmVhdGluZwogICAgY2FsbHN1YiBjZXJyYXJfcmVnaXN0cm9fYW51bGFkb3JlcwogICAgaXRvYgogICAgYnl0ZWNfMiAvLyAweDE1MWY3Yzc1CiAgICBzd2FwCiAgICBjb25jYXQKICAgIGxvZwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKbWFpbl9hYnJpcl9yZWdpc3Ryb19hbnVsYWRvcmVzX3JvdXRlQDExOgogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5Ojg0LTg1CiAgICAvLyAjIE3DqXRvZG9zIHBhcmEgYW51bGFkb3JlcwogICAgLy8gQGFiaW1ldGhvZCgpCiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIGlzIG5vdCBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYXNzZXJ0IC8vIGNhbiBvbmx5IGNhbGwgd2hlbiBub3QgY3JlYXRpbmcKICAgIGNhbGxzdWIgYWJyaXJfcmVnaXN0cm9fYW51bGFkb3JlcwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKbWFpbl9yZWdpc3RyYXJfcmFpel9yb3V0ZUAxMDoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy92b3RvMy9jb250cmFjdC5weTo3NQogICAgLy8gQGFiaW1ldGhvZCgpCiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIGlzIG5vdCBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYXNzZXJ0IC8vIGNhbiBvbmx5IGNhbGwgd2hlbiBub3QgY3JlYXRpbmcKICAgIGNhbGxzdWIgcmVnaXN0cmFyX3JhaXoKICAgIGl0b2IKICAgIGJ5dGVjXzIgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCm1haW5fY2VycmFyX3JlZ2lzdHJvX3JhaWNlc19yb3V0ZUA5OgogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjY3CiAgICAvLyBAYWJpbWV0aG9kKCkKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gaXMgbm90IE5vT3AKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBhc3NlcnQgLy8gY2FuIG9ubHkgY2FsbCB3aGVuIG5vdCBjcmVhdGluZwogICAgY2FsbHN1YiBjZXJyYXJfcmVnaXN0cm9fcmFpY2VzCiAgICBpdG9iCiAgICBieXRlY18yIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgptYWluX2FicmlyX3JlZ2lzdHJvX3JhaWNlc19yb3V0ZUA4OgogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjU5LTYwCiAgICAvLyAjIE3DqXRvZG9zIHBhcmEgcmHDrWNlcwogICAgLy8gQGFiaW1ldGhvZCgpCiAgICB0eG4gT25Db21wbGV0aW9uCiAgICAhCiAgICBhc3NlcnQgLy8gT25Db21wbGV0aW9uIGlzIG5vdCBOb09wCiAgICB0eG4gQXBwbGljYXRpb25JRAogICAgYXNzZXJ0IC8vIGNhbiBvbmx5IGNhbGwgd2hlbiBub3QgY3JlYXRpbmcKICAgIGNhbGxzdWIgYWJyaXJfcmVnaXN0cm9fcmFpY2VzCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgptYWluX3JlZ2lzdHJhcl9jb21wcm9taXNvX3JvdXRlQDc6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6NTAKICAgIC8vIEBhYmltZXRob2QoKQogICAgdHhuIE9uQ29tcGxldGlvbgogICAgIQogICAgYXNzZXJ0IC8vIE9uQ29tcGxldGlvbiBpcyBub3QgTm9PcAogICAgdHhuIEFwcGxpY2F0aW9uSUQKICAgIGFzc2VydCAvLyBjYW4gb25seSBjYWxsIHdoZW4gbm90IGNyZWF0aW5nCiAgICBjYWxsc3ViIHJlZ2lzdHJhcl9jb21wcm9taXNvCiAgICBpdG9iCiAgICBieXRlY18yIC8vIDB4MTUxZjdjNzUKICAgIHN3YXAKICAgIGNvbmNhdAogICAgbG9nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgptYWluX2NlcnJhcl9yZWdpc3Ryb19jb21wcm9taXNvc19yb3V0ZUA2OgogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjQyCiAgICAvLyBAYWJpbWV0aG9kKCkKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gaXMgbm90IE5vT3AKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBhc3NlcnQgLy8gY2FuIG9ubHkgY2FsbCB3aGVuIG5vdCBjcmVhdGluZwogICAgY2FsbHN1YiBjZXJyYXJfcmVnaXN0cm9fY29tcHJvbWlzb3MKICAgIGl0b2IKICAgIGJ5dGVjXzIgLy8gMHgxNTFmN2M3NQogICAgc3dhcAogICAgY29uY2F0CiAgICBsb2cKICAgIGludGNfMSAvLyAxCiAgICByZXR1cm4KCm1haW5fYWJyaXJfcmVnaXN0cm9fY29tcHJvbWlzb3Nfcm91dGVANToKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy92b3RvMy9jb250cmFjdC5weTozNS0zNgogICAgLy8gIyBNw6l0b2RvcyBwYXJhIGNvbXByb21pc29zCiAgICAvLyBAYWJpbWV0aG9kKCkKICAgIHR4biBPbkNvbXBsZXRpb24KICAgICEKICAgIGFzc2VydCAvLyBPbkNvbXBsZXRpb24gaXMgbm90IE5vT3AKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICBhc3NlcnQgLy8gY2FuIG9ubHkgY2FsbCB3aGVuIG5vdCBjcmVhdGluZwogICAgY2FsbHN1YiBhYnJpcl9yZWdpc3Ryb19jb21wcm9taXNvcwogICAgaW50Y18xIC8vIDEKICAgIHJldHVybgoKbWFpbl9iYXJlX3JvdXRpbmdAMTQ6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6NgogICAgLy8gY2xhc3MgVm90bzMoQVJDNENvbnRyYWN0KToKICAgIHR4biBPbkNvbXBsZXRpb24KICAgIGJueiBtYWluX2FmdGVyX2lmX2Vsc2VAMTYKICAgIHR4biBBcHBsaWNhdGlvbklECiAgICAhCiAgICBhc3NlcnQgLy8gY2FuIG9ubHkgY2FsbCB3aGVuIGNyZWF0aW5nCiAgICBpbnRjXzEgLy8gMQogICAgcmV0dXJuCgoKLy8gc21hcnRfY29udHJhY3RzLnZvdG8zLmNvbnRyYWN0LlZvdG8zLmFicmlyX3JlZ2lzdHJvX2NvbXByb21pc29zKCkgLT4gdm9pZDoKYWJyaXJfcmVnaXN0cm9fY29tcHJvbWlzb3M6CiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6MzgKICAgIC8vIGFzc2VydCBUeG4uc2VuZGVyID09IEdsb2JhbC5jcmVhdG9yX2FkZHJlc3MsICJTb2xvIGVsIGNyZWFkb3IgcHVlZGUgYWJyaXIgZWwgcmVnaXN0cm8gZGUgY29tcHJvbWlzb3MiCiAgICB0eG4gU2VuZGVyCiAgICBnbG9iYWwgQ3JlYXRvckFkZHJlc3MKICAgID09CiAgICBhc3NlcnQgLy8gU29sbyBlbCBjcmVhZG9yIHB1ZWRlIGFicmlyIGVsIHJlZ2lzdHJvIGRlIGNvbXByb21pc29zCiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6MzkKICAgIC8vIGFzc2VydCBub3Qgc2VsZi5yZWdpc3Ryb19jb21wcm9taXNvc19jZXJyYWRvLCAiRWwgcmVnaXN0cm8gZGUgY29tcHJvbWlzb3MgeWEgZnVlIGNlcnJhZG8iCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMCAvLyAicmVnaXN0cm9fY29tcHJvbWlzb3NfY2VycmFkbyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi5yZWdpc3Ryb19jb21wcm9taXNvc19jZXJyYWRvIGV4aXN0cwogICAgIQogICAgYXNzZXJ0IC8vIEVsIHJlZ2lzdHJvIGRlIGNvbXByb21pc29zIHlhIGZ1ZSBjZXJyYWRvCiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6NDAKICAgIC8vIHNlbGYucmVnaXN0cm9fY29tcHJvbWlzb3NfYWJpZXJ0byA9IFRydWUKICAgIGJ5dGVjIDcgLy8gInJlZ2lzdHJvX2NvbXByb21pc29zX2FiaWVydG8iCiAgICBpbnRjXzEgLy8gMQogICAgYXBwX2dsb2JhbF9wdXQKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy52b3RvMy5jb250cmFjdC5Wb3RvMy5jZXJyYXJfcmVnaXN0cm9fY29tcHJvbWlzb3MoKSAtPiB1aW50NjQ6CmNlcnJhcl9yZWdpc3Ryb19jb21wcm9taXNvczoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy92b3RvMy9jb250cmFjdC5weTo0NAogICAgLy8gYXNzZXJ0IFR4bi5zZW5kZXIgPT0gR2xvYmFsLmNyZWF0b3JfYWRkcmVzcywgIlNvbG8gZWwgY3JlYWRvciBwdWVkZSBjZXJyYXIgZWwgcmVnaXN0cm8gZGUgY29tcHJvbWlzb3MiCiAgICB0eG4gU2VuZGVyCiAgICBnbG9iYWwgQ3JlYXRvckFkZHJlc3MKICAgID09CiAgICBhc3NlcnQgLy8gU29sbyBlbCBjcmVhZG9yIHB1ZWRlIGNlcnJhciBlbCByZWdpc3RybyBkZSBjb21wcm9taXNvcwogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjQ1CiAgICAvLyBhc3NlcnQgc2VsZi5yZWdpc3Ryb19jb21wcm9taXNvc19hYmllcnRvLCAiRWwgcmVnaXN0cm8gZGUgY29tcHJvbWlzb3Mgbm8gZXN0w6EgYWJpZXJ0byIKICAgIGludGNfMCAvLyAwCiAgICBieXRlYyA3IC8vICJyZWdpc3Ryb19jb21wcm9taXNvc19hYmllcnRvIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBzZWxmLnJlZ2lzdHJvX2NvbXByb21pc29zX2FiaWVydG8gZXhpc3RzCiAgICBhc3NlcnQgLy8gRWwgcmVnaXN0cm8gZGUgY29tcHJvbWlzb3Mgbm8gZXN0w6EgYWJpZXJ0bwogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjQ2CiAgICAvLyBhc3NlcnQgbm90IHNlbGYucmVnaXN0cm9fY29tcHJvbWlzb3NfY2VycmFkbywgIkVsIHJlZ2lzdHJvIGRlIGNvbXByb21pc29zIHlhIGZ1ZSBjZXJyYWRvIgogICAgaW50Y18wIC8vIDAKICAgIGJ5dGVjXzAgLy8gInJlZ2lzdHJvX2NvbXByb21pc29zX2NlcnJhZG8iCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIHNlbGYucmVnaXN0cm9fY29tcHJvbWlzb3NfY2VycmFkbyBleGlzdHMKICAgICEKICAgIGFzc2VydCAvLyBFbCByZWdpc3RybyBkZSBjb21wcm9taXNvcyB5YSBmdWUgY2VycmFkbwogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjQ3CiAgICAvLyBzZWxmLnJlZ2lzdHJvX2NvbXByb21pc29zX2NlcnJhZG8gPSBUcnVlCiAgICBieXRlY18wIC8vICJyZWdpc3Ryb19jb21wcm9taXNvc19jZXJyYWRvIgogICAgaW50Y18xIC8vIDEKICAgIGFwcF9nbG9iYWxfcHV0CiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6NDgKICAgIC8vIHJldHVybiBzZWxmLmNvbnRhZG9yX2NvbXByb21pc29zCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWMgNCAvLyAiY29udGFkb3JfY29tcHJvbWlzb3MiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIHNlbGYuY29udGFkb3JfY29tcHJvbWlzb3MgZXhpc3RzCiAgICByZXRzdWIKCgovLyBzbWFydF9jb250cmFjdHMudm90bzMuY29udHJhY3QuVm90bzMucmVnaXN0cmFyX2NvbXByb21pc28oKSAtPiB1aW50NjQ6CnJlZ2lzdHJhcl9jb21wcm9taXNvOgogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjUyCiAgICAvLyBhc3NlcnQgVHhuLnNlbmRlciA9PSBHbG9iYWwuY3JlYXRvcl9hZGRyZXNzLCAiU29sbyBlbCBjcmVhZG9yIHB1ZWRlIHJlZ2lzdHJhciBjb21wcm9taXNvcyIKICAgIHR4biBTZW5kZXIKICAgIGdsb2JhbCBDcmVhdG9yQWRkcmVzcwogICAgPT0KICAgIGFzc2VydCAvLyBTb2xvIGVsIGNyZWFkb3IgcHVlZGUgcmVnaXN0cmFyIGNvbXByb21pc29zCiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6NTMKICAgIC8vIGFzc2VydCBzZWxmLnJlZ2lzdHJvX2NvbXByb21pc29zX2FiaWVydG8sICJFbCByZWdpc3RybyBkZSBjb21wcm9taXNvcyBubyBlc3TDoSBhYmllcnRvIgogICAgaW50Y18wIC8vIDAKICAgIGJ5dGVjIDcgLy8gInJlZ2lzdHJvX2NvbXByb21pc29zX2FiaWVydG8iCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIHNlbGYucmVnaXN0cm9fY29tcHJvbWlzb3NfYWJpZXJ0byBleGlzdHMKICAgIGFzc2VydCAvLyBFbCByZWdpc3RybyBkZSBjb21wcm9taXNvcyBubyBlc3TDoSBhYmllcnRvCiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6NTQKICAgIC8vIGFzc2VydCBub3Qgc2VsZi5yZWdpc3Ryb19jb21wcm9taXNvc19jZXJyYWRvLCAiRWwgcmVnaXN0cm8gZGUgY29tcHJvbWlzb3MgeWEgZnVlIGNlcnJhZG8iCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMCAvLyAicmVnaXN0cm9fY29tcHJvbWlzb3NfY2VycmFkbyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi5yZWdpc3Ryb19jb21wcm9taXNvc19jZXJyYWRvIGV4aXN0cwogICAgIQogICAgYXNzZXJ0IC8vIEVsIHJlZ2lzdHJvIGRlIGNvbXByb21pc29zIHlhIGZ1ZSBjZXJyYWRvCiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6NTUKICAgIC8vIGN1cnJlbnQgPSBzZWxmLmNvbnRhZG9yX2NvbXByb21pc29zCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWMgNCAvLyAiY29udGFkb3JfY29tcHJvbWlzb3MiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIHNlbGYuY29udGFkb3JfY29tcHJvbWlzb3MgZXhpc3RzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6NTYKICAgIC8vIHNlbGYuY29udGFkb3JfY29tcHJvbWlzb3MgPSBjdXJyZW50ICsgMQogICAgZHVwCiAgICBpbnRjXzEgLy8gMQogICAgKwogICAgYnl0ZWMgNCAvLyAiY29udGFkb3JfY29tcHJvbWlzb3MiCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjU3CiAgICAvLyByZXR1cm4gY3VycmVudAogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzLnZvdG8zLmNvbnRyYWN0LlZvdG8zLmFicmlyX3JlZ2lzdHJvX3JhaWNlcygpIC0+IHZvaWQ6CmFicmlyX3JlZ2lzdHJvX3JhaWNlczoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy92b3RvMy9jb250cmFjdC5weTo2MgogICAgLy8gYXNzZXJ0IFR4bi5zZW5kZXIgPT0gR2xvYmFsLmNyZWF0b3JfYWRkcmVzcywgIlNvbG8gZWwgY3JlYWRvciBwdWVkZSBhYnJpciBlbCByZWdpc3RybyBkZSByYcOtY2VzIgogICAgdHhuIFNlbmRlcgogICAgZ2xvYmFsIENyZWF0b3JBZGRyZXNzCiAgICA9PQogICAgYXNzZXJ0IC8vIFNvbG8gZWwgY3JlYWRvciBwdWVkZSBhYnJpciBlbCByZWdpc3RybyBkZSByYcOtY2VzCiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6NjMKICAgIC8vIGFzc2VydCBzZWxmLnJlZ2lzdHJvX2NvbXByb21pc29zX2NlcnJhZG8sICJFbCByZWdpc3RybyBkZSBjb21wcm9taXNvcyBubyBlc3TDoSBjZXJyYWRvIgogICAgaW50Y18wIC8vIDAKICAgIGJ5dGVjXzAgLy8gInJlZ2lzdHJvX2NvbXByb21pc29zX2NlcnJhZG8iCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIHNlbGYucmVnaXN0cm9fY29tcHJvbWlzb3NfY2VycmFkbyBleGlzdHMKICAgIGFzc2VydCAvLyBFbCByZWdpc3RybyBkZSBjb21wcm9taXNvcyBubyBlc3TDoSBjZXJyYWRvCiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6NjQKICAgIC8vIGFzc2VydCBub3Qgc2VsZi5yZWdpc3Ryb19yYWljZXNfY2VycmFkbywgIkVsIHJlZ2lzdHJvIGRlIHJhw61jZXMgeWEgZnVlIGNlcnJhZG8iCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMSAvLyAicmVnaXN0cm9fcmFpY2VzX2NlcnJhZG8iCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIHNlbGYucmVnaXN0cm9fcmFpY2VzX2NlcnJhZG8gZXhpc3RzCiAgICAhCiAgICBhc3NlcnQgLy8gRWwgcmVnaXN0cm8gZGUgcmHDrWNlcyB5YSBmdWUgY2VycmFkbwogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjY1CiAgICAvLyBzZWxmLnJlZ2lzdHJvX3JhaWNlc19hYmllcnRvID0gVHJ1ZQogICAgYnl0ZWMgOCAvLyAicmVnaXN0cm9fcmFpY2VzX2FiaWVydG8iCiAgICBpbnRjXzEgLy8gMQogICAgYXBwX2dsb2JhbF9wdXQKICAgIHJldHN1YgoKCi8vIHNtYXJ0X2NvbnRyYWN0cy52b3RvMy5jb250cmFjdC5Wb3RvMy5jZXJyYXJfcmVnaXN0cm9fcmFpY2VzKCkgLT4gdWludDY0OgpjZXJyYXJfcmVnaXN0cm9fcmFpY2VzOgogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjY5CiAgICAvLyBhc3NlcnQgVHhuLnNlbmRlciA9PSBHbG9iYWwuY3JlYXRvcl9hZGRyZXNzLCAiU29sbyBlbCBjcmVhZG9yIHB1ZWRlIGNlcnJhciBlbCByZWdpc3RybyBkZSByYcOtY2VzIgogICAgdHhuIFNlbmRlcgogICAgZ2xvYmFsIENyZWF0b3JBZGRyZXNzCiAgICA9PQogICAgYXNzZXJ0IC8vIFNvbG8gZWwgY3JlYWRvciBwdWVkZSBjZXJyYXIgZWwgcmVnaXN0cm8gZGUgcmHDrWNlcwogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjcwCiAgICAvLyBhc3NlcnQgc2VsZi5yZWdpc3Ryb19yYWljZXNfYWJpZXJ0bywgIkVsIHJlZ2lzdHJvIGRlIHJhw61jZXMgbm8gZXN0w6EgY2VycmFkbyIKICAgIGludGNfMCAvLyAwCiAgICBieXRlYyA4IC8vICJyZWdpc3Ryb19yYWljZXNfYWJpZXJ0byIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi5yZWdpc3Ryb19yYWljZXNfYWJpZXJ0byBleGlzdHMKICAgIGFzc2VydCAvLyBFbCByZWdpc3RybyBkZSByYcOtY2VzIG5vIGVzdMOhIGNlcnJhZG8KICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy92b3RvMy9jb250cmFjdC5weTo3MQogICAgLy8gYXNzZXJ0IG5vdCBzZWxmLnJlZ2lzdHJvX3JhaWNlc19jZXJyYWRvLCAiRWwgcmVnaXN0cm8gZGUgcmHDrWNlcyB5YSBmdWUgY2VycmFkbyIKICAgIGludGNfMCAvLyAwCiAgICBieXRlY18xIC8vICJyZWdpc3Ryb19yYWljZXNfY2VycmFkbyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi5yZWdpc3Ryb19yYWljZXNfY2VycmFkbyBleGlzdHMKICAgICEKICAgIGFzc2VydCAvLyBFbCByZWdpc3RybyBkZSByYcOtY2VzIHlhIGZ1ZSBjZXJyYWRvCiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6NzIKICAgIC8vIHNlbGYucmVnaXN0cm9fcmFpY2VzX2NlcnJhZG8gPSBUcnVlCiAgICBieXRlY18xIC8vICJyZWdpc3Ryb19yYWljZXNfY2VycmFkbyIKICAgIGludGNfMSAvLyAxCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjczCiAgICAvLyByZXR1cm4gc2VsZi5jb250YWRvcl9yYWljZXMKICAgIGludGNfMCAvLyAwCiAgICBieXRlYyA1IC8vICJjb250YWRvcl9yYWljZXMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIHNlbGYuY29udGFkb3JfcmFpY2VzIGV4aXN0cwogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzLnZvdG8zLmNvbnRyYWN0LlZvdG8zLnJlZ2lzdHJhcl9yYWl6KCkgLT4gdWludDY0OgpyZWdpc3RyYXJfcmFpejoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy92b3RvMy9jb250cmFjdC5weTo3NwogICAgLy8gYXNzZXJ0IFR4bi5zZW5kZXIgPT0gR2xvYmFsLmNyZWF0b3JfYWRkcmVzcywgIlNvbG8gZWwgY3JlYWRvciBwdWVkZSByZWdpc3RyYXIgcmHDrWNlcyIKICAgIHR4biBTZW5kZXIKICAgIGdsb2JhbCBDcmVhdG9yQWRkcmVzcwogICAgPT0KICAgIGFzc2VydCAvLyBTb2xvIGVsIGNyZWFkb3IgcHVlZGUgcmVnaXN0cmFyIHJhw61jZXMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy92b3RvMy9jb250cmFjdC5weTo3OAogICAgLy8gYXNzZXJ0IHNlbGYucmVnaXN0cm9fcmFpY2VzX2FiaWVydG8sICJFbCByZWdpc3RybyBkZSByYcOtY2VzIG5vIGVzdMOhIGFiaWVydG8iCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWMgOCAvLyAicmVnaXN0cm9fcmFpY2VzX2FiaWVydG8iCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIHNlbGYucmVnaXN0cm9fcmFpY2VzX2FiaWVydG8gZXhpc3RzCiAgICBhc3NlcnQgLy8gRWwgcmVnaXN0cm8gZGUgcmHDrWNlcyBubyBlc3TDoSBhYmllcnRvCiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6NzkKICAgIC8vIGFzc2VydCBub3Qgc2VsZi5yZWdpc3Ryb19yYWljZXNfY2VycmFkbywgIkVsIHJlZ2lzdHJvIGRlIHJhw61jZXMgeWEgZnVlIGNlcnJhZG8iCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMSAvLyAicmVnaXN0cm9fcmFpY2VzX2NlcnJhZG8iCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIHNlbGYucmVnaXN0cm9fcmFpY2VzX2NlcnJhZG8gZXhpc3RzCiAgICAhCiAgICBhc3NlcnQgLy8gRWwgcmVnaXN0cm8gZGUgcmHDrWNlcyB5YSBmdWUgY2VycmFkbwogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjgwCiAgICAvLyBjdXJyZW50ID0gc2VsZi5jb250YWRvcl9yYWljZXMKICAgIGludGNfMCAvLyAwCiAgICBieXRlYyA1IC8vICJjb250YWRvcl9yYWljZXMiCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIHNlbGYuY29udGFkb3JfcmFpY2VzIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjgxCiAgICAvLyBzZWxmLmNvbnRhZG9yX3JhaWNlcyA9IGN1cnJlbnQgKyAxCiAgICBkdXAKICAgIGludGNfMSAvLyAxCiAgICArCiAgICBieXRlYyA1IC8vICJjb250YWRvcl9yYWljZXMiCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjgyCiAgICAvLyByZXR1cm4gY3VycmVudAogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzLnZvdG8zLmNvbnRyYWN0LlZvdG8zLmFicmlyX3JlZ2lzdHJvX2FudWxhZG9yZXMoKSAtPiB2b2lkOgphYnJpcl9yZWdpc3Ryb19hbnVsYWRvcmVzOgogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5Ojg3CiAgICAvLyBhc3NlcnQgVHhuLnNlbmRlciA9PSBHbG9iYWwuY3JlYXRvcl9hZGRyZXNzLCAiU29sbyBlbCBjcmVhZG9yIHB1ZWRlIGFicmlyIGVsIHJlZ2lzdHJvIGRlIGFudWxhZG9yZXMiCiAgICB0eG4gU2VuZGVyCiAgICBnbG9iYWwgQ3JlYXRvckFkZHJlc3MKICAgID09CiAgICBhc3NlcnQgLy8gU29sbyBlbCBjcmVhZG9yIHB1ZWRlIGFicmlyIGVsIHJlZ2lzdHJvIGRlIGFudWxhZG9yZXMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy92b3RvMy9jb250cmFjdC5weTo4OAogICAgLy8gYXNzZXJ0IHNlbGYucmVnaXN0cm9fcmFpY2VzX2NlcnJhZG8sICJFbCByZWdpc3RybyBkZSByYcOtY2VzIG5vIGVzdMOhIGNlcnJhZG8iCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMSAvLyAicmVnaXN0cm9fcmFpY2VzX2NlcnJhZG8iCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIHNlbGYucmVnaXN0cm9fcmFpY2VzX2NlcnJhZG8gZXhpc3RzCiAgICBhc3NlcnQgLy8gRWwgcmVnaXN0cm8gZGUgcmHDrWNlcyBubyBlc3TDoSBjZXJyYWRvCiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6ODkKICAgIC8vIGFzc2VydCBub3Qgc2VsZi5yZWdpc3Ryb19hbnVsYWRvcmVzX2NlcnJhZG8sICJFbCByZWdpc3RybyBkZSBhbnVsYWRvcmVzIHlhIGZ1ZSBjZXJyYWRvIgogICAgaW50Y18wIC8vIDAKICAgIGJ5dGVjXzMgLy8gInJlZ2lzdHJvX2FudWxhZG9yZXNfY2VycmFkbyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi5yZWdpc3Ryb19hbnVsYWRvcmVzX2NlcnJhZG8gZXhpc3RzCiAgICAhCiAgICBhc3NlcnQgLy8gRWwgcmVnaXN0cm8gZGUgYW51bGFkb3JlcyB5YSBmdWUgY2VycmFkbwogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjkwCiAgICAvLyBzZWxmLnJlZ2lzdHJvX2FudWxhZG9yZXNfYWJpZXJ0byA9IFRydWUKICAgIGJ5dGVjIDkgLy8gInJlZ2lzdHJvX2FudWxhZG9yZXNfYWJpZXJ0byIKICAgIGludGNfMSAvLyAxCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzLnZvdG8zLmNvbnRyYWN0LlZvdG8zLmNlcnJhcl9yZWdpc3Ryb19hbnVsYWRvcmVzKCkgLT4gdWludDY0OgpjZXJyYXJfcmVnaXN0cm9fYW51bGFkb3JlczoKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy92b3RvMy9jb250cmFjdC5weTo5NAogICAgLy8gYXNzZXJ0IFR4bi5zZW5kZXIgPT0gR2xvYmFsLmNyZWF0b3JfYWRkcmVzcywgIlNvbG8gZWwgY3JlYWRvciBwdWVkZSBjZXJyYXIgZWwgcmVnaXN0cm8gZGUgYW51bGFkb3JlcyIKICAgIHR4biBTZW5kZXIKICAgIGdsb2JhbCBDcmVhdG9yQWRkcmVzcwogICAgPT0KICAgIGFzc2VydCAvLyBTb2xvIGVsIGNyZWFkb3IgcHVlZGUgY2VycmFyIGVsIHJlZ2lzdHJvIGRlIGFudWxhZG9yZXMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy92b3RvMy9jb250cmFjdC5weTo5NQogICAgLy8gYXNzZXJ0IHNlbGYucmVnaXN0cm9fYW51bGFkb3Jlc19hYmllcnRvLCAiRWwgcmVnaXN0cm8gZGUgcmHDrWNlcyBubyBlc3TDoSBjZXJyYWRvIgogICAgaW50Y18wIC8vIDAKICAgIGJ5dGVjIDkgLy8gInJlZ2lzdHJvX2FudWxhZG9yZXNfYWJpZXJ0byIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi5yZWdpc3Ryb19hbnVsYWRvcmVzX2FiaWVydG8gZXhpc3RzCiAgICBhc3NlcnQgLy8gRWwgcmVnaXN0cm8gZGUgcmHDrWNlcyBubyBlc3TDoSBjZXJyYWRvCiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6OTYKICAgIC8vIGFzc2VydCBub3Qgc2VsZi5yZWdpc3Ryb19hbnVsYWRvcmVzX2NlcnJhZG8sICJFbCByZWdpc3RybyBkZSByYcOtY2VzIHlhIGZ1ZSBjZXJyYWRvIgogICAgaW50Y18wIC8vIDAKICAgIGJ5dGVjXzMgLy8gInJlZ2lzdHJvX2FudWxhZG9yZXNfY2VycmFkbyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi5yZWdpc3Ryb19hbnVsYWRvcmVzX2NlcnJhZG8gZXhpc3RzCiAgICAhCiAgICBhc3NlcnQgLy8gRWwgcmVnaXN0cm8gZGUgcmHDrWNlcyB5YSBmdWUgY2VycmFkbwogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5Ojk3CiAgICAvLyBzZWxmLnJlZ2lzdHJvX2FudWxhZG9yZXNfY2VycmFkbyA9IFRydWUKICAgIGJ5dGVjXzMgLy8gInJlZ2lzdHJvX2FudWxhZG9yZXNfY2VycmFkbyIKICAgIGludGNfMSAvLyAxCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5Ojk4CiAgICAvLyByZXR1cm4gc2VsZi5jb250YWRvcl9hbnVsYWRvcmVzCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWMgNiAvLyAiY29udGFkb3JfYW51bGFkb3JlcyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi5jb250YWRvcl9hbnVsYWRvcmVzIGV4aXN0cwogICAgcmV0c3ViCgoKLy8gc21hcnRfY29udHJhY3RzLnZvdG8zLmNvbnRyYWN0LlZvdG8zLnJlZ2lzdHJhcl9hbnVsYWRvcigpIC0+IHVpbnQ2NDoKcmVnaXN0cmFyX2FudWxhZG9yOgogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjEwMgogICAgLy8gYXNzZXJ0IFR4bi5zZW5kZXIgPT0gR2xvYmFsLmNyZWF0b3JfYWRkcmVzcywgIlNvbG8gZWwgY3JlYWRvciBwdWVkZSByZWdpc3RyYXIgYW51bGFkb3JlcyIKICAgIHR4biBTZW5kZXIKICAgIGdsb2JhbCBDcmVhdG9yQWRkcmVzcwogICAgPT0KICAgIGFzc2VydCAvLyBTb2xvIGVsIGNyZWFkb3IgcHVlZGUgcmVnaXN0cmFyIGFudWxhZG9yZXMKICAgIC8vIHNtYXJ0X2NvbnRyYWN0cy92b3RvMy9jb250cmFjdC5weToxMDMKICAgIC8vIGFzc2VydCBzZWxmLnJlZ2lzdHJvX2FudWxhZG9yZXNfYWJpZXJ0bywgIkVsIHJlZ2lzdHJvIGRlIGFudWxhZG9yZXMgbm8gZXN0w6EgYWJpZXJ0byIKICAgIGludGNfMCAvLyAwCiAgICBieXRlYyA5IC8vICJyZWdpc3Ryb19hbnVsYWRvcmVzX2FiaWVydG8iCiAgICBhcHBfZ2xvYmFsX2dldF9leAogICAgYXNzZXJ0IC8vIGNoZWNrIHNlbGYucmVnaXN0cm9fYW51bGFkb3Jlc19hYmllcnRvIGV4aXN0cwogICAgYXNzZXJ0IC8vIEVsIHJlZ2lzdHJvIGRlIGFudWxhZG9yZXMgbm8gZXN0w6EgYWJpZXJ0bwogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjEwNAogICAgLy8gYXNzZXJ0IG5vdCBzZWxmLnJlZ2lzdHJvX2FudWxhZG9yZXNfY2VycmFkbywgIkVsIHJlZ2lzdHJvIGRlIGFudWxhZG9yZXMgeWEgZnVlIGNlcnJhZG8iCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWNfMyAvLyAicmVnaXN0cm9fYW51bGFkb3Jlc19jZXJyYWRvIgogICAgYXBwX2dsb2JhbF9nZXRfZXgKICAgIGFzc2VydCAvLyBjaGVjayBzZWxmLnJlZ2lzdHJvX2FudWxhZG9yZXNfY2VycmFkbyBleGlzdHMKICAgICEKICAgIGFzc2VydCAvLyBFbCByZWdpc3RybyBkZSBhbnVsYWRvcmVzIHlhIGZ1ZSBjZXJyYWRvCiAgICAvLyBzbWFydF9jb250cmFjdHMvdm90bzMvY29udHJhY3QucHk6MTA1CiAgICAvLyBjdXJyZW50ID0gc2VsZi5jb250YWRvcl9hbnVsYWRvcmVzCiAgICBpbnRjXzAgLy8gMAogICAgYnl0ZWMgNiAvLyAiY29udGFkb3JfYW51bGFkb3JlcyIKICAgIGFwcF9nbG9iYWxfZ2V0X2V4CiAgICBhc3NlcnQgLy8gY2hlY2sgc2VsZi5jb250YWRvcl9hbnVsYWRvcmVzIGV4aXN0cwogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjEwNgogICAgLy8gc2VsZi5jb250YWRvcl9hbnVsYWRvcmVzID0gY3VycmVudCArIDEKICAgIGR1cAogICAgaW50Y18xIC8vIDEKICAgICsKICAgIGJ5dGVjIDYgLy8gImNvbnRhZG9yX2FudWxhZG9yZXMiCiAgICBzd2FwCiAgICBhcHBfZ2xvYmFsX3B1dAogICAgLy8gc21hcnRfY29udHJhY3RzL3ZvdG8zL2NvbnRyYWN0LnB5OjEwNwogICAgLy8gcmV0dXJuIGN1cnJlbnQKICAgIHJldHN1Ygo=", "clear": "I3ByYWdtYSB2ZXJzaW9uIDEwCiNwcmFnbWEgdHlwZXRyYWNrIGZhbHNlCgovLyBhbGdvcHkuYXJjNC5BUkM0Q29udHJhY3QuY2xlYXJfc3RhdGVfcHJvZ3JhbSgpIC0+IHVpbnQ2NDoKbWFpbjoKICAgIHB1c2hpbnQgMSAvLyAxCiAgICByZXR1cm4K" }, "byteCode": { "approval": "CiACAAEmChxyZWdpc3Ryb19jb21wcm9taXNvc19jZXJyYWRvF3JlZ2lzdHJvX3JhaWNlc19jZXJyYWRvBBUffHUbcmVnaXN0cm9fYW51bGFkb3Jlc19jZXJyYWRvFGNvbnRhZG9yX2NvbXByb21pc29zD2NvbnRhZG9yX3JhaWNlcxNjb250YWRvcl9hbnVsYWRvcmVzHHJlZ2lzdHJvX2NvbXByb21pc29zX2FiaWVydG8XcmVnaXN0cm9fcmFpY2VzX2FiaWVydG8bcmVnaXN0cm9fYW51bGFkb3Jlc19hYmllcnRvMRhAACEnBCJnJwUiZycGImcnByJnKCJnJwgiZykiZycJImcrImcxG0EA0oIJBMf+k8AEiAKd0gQQm2phBJp+dlEEaU6W4QScF6QwBE6BLPcEgAZ47AS5vc7BNhoAjgkAgABvAF4AUgBBADAAJAATAAIiQzEZFEQxGESIAVcWKkxQsCNDMRkURDEYRIgBKxYqTFCwI0MxGRREMRhEiAEEI0MxGRREMRhEiADZFipMULAjQzEZFEQxGESIAK0WKkxQsCNDMRkURDEYRIgAhiNDMRkURDEYRIgAWxYqTFCwI0MxGRREMRhEiAAvFipMULAjQzEZFEQxGESIAA0jQzEZQP9vMRgURCNDMQAyCRJEIihlRBREJwcjZ4kxADIJEkQiJwdlREQiKGVEFEQoI2ciJwRlRIkxADIJEkQiJwdlREQiKGVEFEQiJwRlREkjCCcETGeJMQAyCRJEIihlREQiKWVEFEQnCCNniTEAMgkSRCInCGVERCIpZUQURCkjZyInBWVEiTEAMgkSRCInCGVERCIpZUQURCInBWVESSMIJwVMZ4kxADIJEkQiKWVERCIrZUQURCcJI2eJMQAyCRJEIicJZUREIitlRBREKyNnIicGZUSJMQAyCRJEIicJZUREIitlRBREIicGZURJIwgnBkxniQ==", "clear": "CoEBQw==" }, "compilerInfo": { "compiler": "puya", "compilerVersion": { "major": 4, "minor": 9, "patch": 0 } }, "events": [], "templateVariables": {} };
class BinaryStateValue {
    constructor(value) {
        this.value = value;
    }
    asByteArray() {
        return this.value;
    }
    asString() {
        return this.value !== undefined ? Buffer.from(this.value).toString('utf-8') : undefined;
    }
}
/**
 * Exposes methods for constructing `AppClient` params objects for ABI calls to the Voto3 smart contract
 */
export class Voto3ParamsFactory {
    /**
     * Constructs a no op call for the abrir_registro_compromisos()void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static abrirRegistroCompromisos(params) {
        return {
            ...params,
            method: 'abrir_registro_compromisos()void',
            args: Array.isArray(params.args) ? params.args : [],
        };
    }
    /**
     * Constructs a no op call for the cerrar_registro_compromisos()uint64 ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static cerrarRegistroCompromisos(params) {
        return {
            ...params,
            method: 'cerrar_registro_compromisos()uint64',
            args: Array.isArray(params.args) ? params.args : [],
        };
    }
    /**
     * Constructs a no op call for the registrar_compromiso()uint64 ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static registrarCompromiso(params) {
        return {
            ...params,
            method: 'registrar_compromiso()uint64',
            args: Array.isArray(params.args) ? params.args : [],
        };
    }
    /**
     * Constructs a no op call for the abrir_registro_raices()void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static abrirRegistroRaices(params) {
        return {
            ...params,
            method: 'abrir_registro_raices()void',
            args: Array.isArray(params.args) ? params.args : [],
        };
    }
    /**
     * Constructs a no op call for the cerrar_registro_raices()uint64 ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static cerrarRegistroRaices(params) {
        return {
            ...params,
            method: 'cerrar_registro_raices()uint64',
            args: Array.isArray(params.args) ? params.args : [],
        };
    }
    /**
     * Constructs a no op call for the registrar_raiz()uint64 ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static registrarRaiz(params) {
        return {
            ...params,
            method: 'registrar_raiz()uint64',
            args: Array.isArray(params.args) ? params.args : [],
        };
    }
    /**
     * Constructs a no op call for the abrir_registro_anuladores()void ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static abrirRegistroAnuladores(params) {
        return {
            ...params,
            method: 'abrir_registro_anuladores()void',
            args: Array.isArray(params.args) ? params.args : [],
        };
    }
    /**
     * Constructs a no op call for the cerrar_registro_anuladores()uint64 ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static cerrarRegistroAnuladores(params) {
        return {
            ...params,
            method: 'cerrar_registro_anuladores()uint64',
            args: Array.isArray(params.args) ? params.args : [],
        };
    }
    /**
     * Constructs a no op call for the registrar_anulador()uint64 ABI method
     *
     * @param params Parameters for the call
     * @returns An `AppClientMethodCallParams` object for the call
     */
    static registrarAnulador(params) {
        return {
            ...params,
            method: 'registrar_anulador()uint64',
            args: Array.isArray(params.args) ? params.args : [],
        };
    }
}
/**
 * A factory to create and deploy one or more instance of the Voto3 smart contract and to create one or more app clients to interact with those (or other) app instances
 */
export class Voto3Factory {
    /**
     * Creates a new instance of `Voto3Factory`
     *
     * @param params The parameters to initialise the app factory with
     */
    constructor(params) {
        /**
         * Get parameters to create transactions (create and deploy related calls) for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Gets available create methods
             */
            create: {
                /**
                 * Creates a new instance of the Voto3 smart contract using a bare call.
                 *
                 * @param params The params for the bare (raw) call
                 * @returns The params for a create call
                 */
                bare: (params) => {
                    return this.appFactory.params.bare.create(params);
                },
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Gets available create methods
             */
            create: {
                /**
                 * Creates a new instance of the Voto3 smart contract using a bare call.
                 *
                 * @param params The params for the bare (raw) call
                 * @returns The transaction for a create call
                 */
                bare: (params) => {
                    return this.appFactory.createTransaction.bare.create(params);
                },
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Gets available create methods
             */
            create: {
                /**
                 * Creates a new instance of the Voto3 smart contract using a bare call.
                 *
                 * @param params The params for the bare (raw) call
                 * @returns The create result
                 */
                bare: async (params) => {
                    const result = await this.appFactory.send.bare.create(params);
                    return { result: result.result, appClient: new Voto3Client(result.appClient) };
                },
            },
        };
        this.appFactory = new _AppFactory({
            ...params,
            appSpec: APP_SPEC,
        });
    }
    /** The name of the app (from the ARC-32 / ARC-56 app spec or override). */
    get appName() {
        return this.appFactory.appName;
    }
    /** The ARC-56 app spec being used */
    get appSpec() {
        return APP_SPEC;
    }
    /** A reference to the underlying `AlgorandClient` this app factory is using. */
    get algorand() {
        return this.appFactory.algorand;
    }
    /**
     * Returns a new `AppClient` client for an app instance of the given ID.
     *
     * Automatically populates appName, defaultSender and source maps from the factory
     * if not specified in the params.
     * @param params The parameters to create the app client
     * @returns The `AppClient`
     */
    getAppClientById(params) {
        return new Voto3Client(this.appFactory.getAppClientById(params));
    }
    /**
     * Returns a new `AppClient` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     *
     * Automatically populates appName, defaultSender and source maps from the factory
     * if not specified in the params.
     * @param params The parameters to create the app client
     * @returns The `AppClient`
     */
    async getAppClientByCreatorAndName(params) {
        return new Voto3Client(await this.appFactory.getAppClientByCreatorAndName(params));
    }
    /**
     * Idempotently deploys the Voto3 smart contract.
     *
     * @param params The arguments for the contract calls and any additional parameters for the call
     * @returns The deployment result
     */
    async deploy(params = {}) {
        const result = await this.appFactory.deploy({
            ...params,
        });
        return { result: result.result, appClient: new Voto3Client(result.appClient) };
    }
}
/**
 * A client to make calls to the Voto3 smart contract
 */
export class Voto3Client {
    constructor(appClientOrParams) {
        /**
         * Get parameters to create transactions for the current app. A good mental model for this is that these parameters represent a deferred transaction creation.
         */
        this.params = {
            /**
             * Makes a clear_state call to an existing instance of the Voto3 smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.params.bare.clearState(params);
            },
            /**
             * Makes a call to the Voto3 smart contract using the `abrir_registro_compromisos()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            abrirRegistroCompromisos: (params = { args: [] }) => {
                return this.appClient.params.call(Voto3ParamsFactory.abrirRegistroCompromisos(params));
            },
            /**
             * Makes a call to the Voto3 smart contract using the `cerrar_registro_compromisos()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            cerrarRegistroCompromisos: (params = { args: [] }) => {
                return this.appClient.params.call(Voto3ParamsFactory.cerrarRegistroCompromisos(params));
            },
            /**
             * Makes a call to the Voto3 smart contract using the `registrar_compromiso()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            registrarCompromiso: (params = { args: [] }) => {
                return this.appClient.params.call(Voto3ParamsFactory.registrarCompromiso(params));
            },
            /**
             * Makes a call to the Voto3 smart contract using the `abrir_registro_raices()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            abrirRegistroRaices: (params = { args: [] }) => {
                return this.appClient.params.call(Voto3ParamsFactory.abrirRegistroRaices(params));
            },
            /**
             * Makes a call to the Voto3 smart contract using the `cerrar_registro_raices()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            cerrarRegistroRaices: (params = { args: [] }) => {
                return this.appClient.params.call(Voto3ParamsFactory.cerrarRegistroRaices(params));
            },
            /**
             * Makes a call to the Voto3 smart contract using the `registrar_raiz()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            registrarRaiz: (params = { args: [] }) => {
                return this.appClient.params.call(Voto3ParamsFactory.registrarRaiz(params));
            },
            /**
             * Makes a call to the Voto3 smart contract using the `abrir_registro_anuladores()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            abrirRegistroAnuladores: (params = { args: [] }) => {
                return this.appClient.params.call(Voto3ParamsFactory.abrirRegistroAnuladores(params));
            },
            /**
             * Makes a call to the Voto3 smart contract using the `cerrar_registro_anuladores()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            cerrarRegistroAnuladores: (params = { args: [] }) => {
                return this.appClient.params.call(Voto3ParamsFactory.cerrarRegistroAnuladores(params));
            },
            /**
             * Makes a call to the Voto3 smart contract using the `registrar_anulador()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call params
             */
            registrarAnulador: (params = { args: [] }) => {
                return this.appClient.params.call(Voto3ParamsFactory.registrarAnulador(params));
            },
        };
        /**
         * Create transactions for the current app
         */
        this.createTransaction = {
            /**
             * Makes a clear_state call to an existing instance of the Voto3 smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.createTransaction.bare.clearState(params);
            },
            /**
             * Makes a call to the Voto3 smart contract using the `abrir_registro_compromisos()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            abrirRegistroCompromisos: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(Voto3ParamsFactory.abrirRegistroCompromisos(params));
            },
            /**
             * Makes a call to the Voto3 smart contract using the `cerrar_registro_compromisos()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            cerrarRegistroCompromisos: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(Voto3ParamsFactory.cerrarRegistroCompromisos(params));
            },
            /**
             * Makes a call to the Voto3 smart contract using the `registrar_compromiso()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            registrarCompromiso: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(Voto3ParamsFactory.registrarCompromiso(params));
            },
            /**
             * Makes a call to the Voto3 smart contract using the `abrir_registro_raices()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            abrirRegistroRaices: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(Voto3ParamsFactory.abrirRegistroRaices(params));
            },
            /**
             * Makes a call to the Voto3 smart contract using the `cerrar_registro_raices()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            cerrarRegistroRaices: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(Voto3ParamsFactory.cerrarRegistroRaices(params));
            },
            /**
             * Makes a call to the Voto3 smart contract using the `registrar_raiz()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            registrarRaiz: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(Voto3ParamsFactory.registrarRaiz(params));
            },
            /**
             * Makes a call to the Voto3 smart contract using the `abrir_registro_anuladores()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            abrirRegistroAnuladores: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(Voto3ParamsFactory.abrirRegistroAnuladores(params));
            },
            /**
             * Makes a call to the Voto3 smart contract using the `cerrar_registro_anuladores()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            cerrarRegistroAnuladores: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(Voto3ParamsFactory.cerrarRegistroAnuladores(params));
            },
            /**
             * Makes a call to the Voto3 smart contract using the `registrar_anulador()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call transaction
             */
            registrarAnulador: (params = { args: [] }) => {
                return this.appClient.createTransaction.call(Voto3ParamsFactory.registrarAnulador(params));
            },
        };
        /**
         * Send calls to the current app
         */
        this.send = {
            /**
             * Makes a clear_state call to an existing instance of the Voto3 smart contract.
             *
             * @param params The params for the bare (raw) call
             * @returns The clearState result
             */
            clearState: (params) => {
                return this.appClient.send.bare.clearState(params);
            },
            /**
             * Makes a call to the Voto3 smart contract using the `abrir_registro_compromisos()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            abrirRegistroCompromisos: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(Voto3ParamsFactory.abrirRegistroCompromisos(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the Voto3 smart contract using the `cerrar_registro_compromisos()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            cerrarRegistroCompromisos: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(Voto3ParamsFactory.cerrarRegistroCompromisos(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the Voto3 smart contract using the `registrar_compromiso()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            registrarCompromiso: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(Voto3ParamsFactory.registrarCompromiso(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the Voto3 smart contract using the `abrir_registro_raices()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            abrirRegistroRaices: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(Voto3ParamsFactory.abrirRegistroRaices(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the Voto3 smart contract using the `cerrar_registro_raices()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            cerrarRegistroRaices: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(Voto3ParamsFactory.cerrarRegistroRaices(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the Voto3 smart contract using the `registrar_raiz()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            registrarRaiz: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(Voto3ParamsFactory.registrarRaiz(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the Voto3 smart contract using the `abrir_registro_anuladores()void` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            abrirRegistroAnuladores: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(Voto3ParamsFactory.abrirRegistroAnuladores(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the Voto3 smart contract using the `cerrar_registro_anuladores()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            cerrarRegistroAnuladores: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(Voto3ParamsFactory.cerrarRegistroAnuladores(params));
                return { ...result, return: result.return };
            },
            /**
             * Makes a call to the Voto3 smart contract using the `registrar_anulador()uint64` ABI method.
             *
             * @param params The params for the smart contract call
             * @returns The call result
             */
            registrarAnulador: async (params = { args: [] }) => {
                const result = await this.appClient.send.call(Voto3ParamsFactory.registrarAnulador(params));
                return { ...result, return: result.return };
            },
        };
        /**
         * Methods to access state for the current Voto3 app
         */
        this.state = {
            /**
             * Methods to access global state for the current Voto3 app
             */
            global: {
                /**
                 * Get all current keyed values from global state
                 */
                getAll: async () => {
                    const result = await this.appClient.state.global.getAll();
                    return {
                        contadorCompromisos: result.contador_compromisos,
                        contadorRaices: result.contador_raices,
                        contadorAnuladores: result.contador_anuladores,
                        registroCompromisosAbierto: result.registro_compromisos_abierto,
                        registroCompromisosCerrado: result.registro_compromisos_cerrado,
                        registroRaicesAbierto: result.registro_raices_abierto,
                        registroRaicesCerrado: result.registro_raices_cerrado,
                        registroAnuladoresAbierto: result.registro_anuladores_abierto,
                        registroAnuladoresCerrado: result.registro_anuladores_cerrado,
                    };
                },
                /**
                 * Get the current value of the contador_compromisos key in global state
                 */
                contadorCompromisos: async () => { return (await this.appClient.state.global.getValue("contador_compromisos")); },
                /**
                 * Get the current value of the contador_raices key in global state
                 */
                contadorRaices: async () => { return (await this.appClient.state.global.getValue("contador_raices")); },
                /**
                 * Get the current value of the contador_anuladores key in global state
                 */
                contadorAnuladores: async () => { return (await this.appClient.state.global.getValue("contador_anuladores")); },
                /**
                 * Get the current value of the registro_compromisos_abierto key in global state
                 */
                registroCompromisosAbierto: async () => { return (await this.appClient.state.global.getValue("registro_compromisos_abierto")); },
                /**
                 * Get the current value of the registro_compromisos_cerrado key in global state
                 */
                registroCompromisosCerrado: async () => { return (await this.appClient.state.global.getValue("registro_compromisos_cerrado")); },
                /**
                 * Get the current value of the registro_raices_abierto key in global state
                 */
                registroRaicesAbierto: async () => { return (await this.appClient.state.global.getValue("registro_raices_abierto")); },
                /**
                 * Get the current value of the registro_raices_cerrado key in global state
                 */
                registroRaicesCerrado: async () => { return (await this.appClient.state.global.getValue("registro_raices_cerrado")); },
                /**
                 * Get the current value of the registro_anuladores_abierto key in global state
                 */
                registroAnuladoresAbierto: async () => { return (await this.appClient.state.global.getValue("registro_anuladores_abierto")); },
                /**
                 * Get the current value of the registro_anuladores_cerrado key in global state
                 */
                registroAnuladoresCerrado: async () => { return (await this.appClient.state.global.getValue("registro_anuladores_cerrado")); },
            },
        };
        this.appClient = appClientOrParams instanceof _AppClient ? appClientOrParams : new _AppClient({
            ...appClientOrParams,
            appSpec: APP_SPEC,
        });
    }
    /**
     * Checks for decode errors on the given return value and maps the return value to the return type for the given method
     * @returns The typed return value or undefined if there was no value
     */
    decodeReturnValue(method, returnValue) {
        return returnValue !== undefined ? getArc56ReturnValue(returnValue, this.appClient.getABIMethod(method), APP_SPEC.structs) : undefined;
    }
    /**
     * Returns a new `Voto3Client` client, resolving the app by creator address and name
     * using AlgoKit app deployment semantics (i.e. looking for the app creation transaction note).
     * @param params The parameters to create the app client
     */
    static async fromCreatorAndName(params) {
        return new Voto3Client(await _AppClient.fromCreatorAndName({ ...params, appSpec: APP_SPEC }));
    }
    /**
     * Returns an `Voto3Client` instance for the current network based on
     * pre-determined network-specific app IDs specified in the ARC-56 app spec.
     *
     * If no IDs are in the app spec or the network isn't recognised, an error is thrown.
     * @param params The parameters to create the app client
     */
    static async fromNetwork(params) {
        return new Voto3Client(await _AppClient.fromNetwork({ ...params, appSpec: APP_SPEC }));
    }
    /** The ID of the app instance this client is linked to. */
    get appId() {
        return this.appClient.appId;
    }
    /** The app address of the app instance this client is linked to. */
    get appAddress() {
        return this.appClient.appAddress;
    }
    /** The name of the app. */
    get appName() {
        return this.appClient.appName;
    }
    /** The ARC-56 app spec being used */
    get appSpec() {
        return this.appClient.appSpec;
    }
    /** A reference to the underlying `AlgorandClient` this app client is using. */
    get algorand() {
        return this.appClient.algorand;
    }
    /**
     * Clone this app client with different params
     *
     * @param params The params to use for the the cloned app client. Omit a param to keep the original value. Set a param to override the original value. Setting to undefined will clear the original value.
     * @returns A new app client with the altered params
     */
    clone(params) {
        return new Voto3Client(this.appClient.clone(params));
    }
    newGroup() {
        const client = this;
        const composer = this.algorand.newGroup();
        let promiseChain = Promise.resolve();
        const resultMappers = [];
        return {
            /**
             * Add a abrir_registro_compromisos()void method call against the Voto3 contract
             */
            abrirRegistroCompromisos(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.abrirRegistroCompromisos(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a cerrar_registro_compromisos()uint64 method call against the Voto3 contract
             */
            cerrarRegistroCompromisos(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.cerrarRegistroCompromisos(params)));
                resultMappers.push((v) => client.decodeReturnValue('cerrar_registro_compromisos()uint64', v));
                return this;
            },
            /**
             * Add a registrar_compromiso()uint64 method call against the Voto3 contract
             */
            registrarCompromiso(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.registrarCompromiso(params)));
                resultMappers.push((v) => client.decodeReturnValue('registrar_compromiso()uint64', v));
                return this;
            },
            /**
             * Add a abrir_registro_raices()void method call against the Voto3 contract
             */
            abrirRegistroRaices(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.abrirRegistroRaices(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a cerrar_registro_raices()uint64 method call against the Voto3 contract
             */
            cerrarRegistroRaices(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.cerrarRegistroRaices(params)));
                resultMappers.push((v) => client.decodeReturnValue('cerrar_registro_raices()uint64', v));
                return this;
            },
            /**
             * Add a registrar_raiz()uint64 method call against the Voto3 contract
             */
            registrarRaiz(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.registrarRaiz(params)));
                resultMappers.push((v) => client.decodeReturnValue('registrar_raiz()uint64', v));
                return this;
            },
            /**
             * Add a abrir_registro_anuladores()void method call against the Voto3 contract
             */
            abrirRegistroAnuladores(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.abrirRegistroAnuladores(params)));
                resultMappers.push(undefined);
                return this;
            },
            /**
             * Add a cerrar_registro_anuladores()uint64 method call against the Voto3 contract
             */
            cerrarRegistroAnuladores(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.cerrarRegistroAnuladores(params)));
                resultMappers.push((v) => client.decodeReturnValue('cerrar_registro_anuladores()uint64', v));
                return this;
            },
            /**
             * Add a registrar_anulador()uint64 method call against the Voto3 contract
             */
            registrarAnulador(params) {
                promiseChain = promiseChain.then(async () => composer.addAppCallMethodCall(await client.params.registrarAnulador(params)));
                resultMappers.push((v) => client.decodeReturnValue('registrar_anulador()uint64', v));
                return this;
            },
            /**
             * Add a clear state call to the Voto3 contract
             */
            clearState(params) {
                promiseChain = promiseChain.then(() => composer.addAppCall(client.params.clearState(params)));
                return this;
            },
            addTransaction(txn, signer) {
                promiseChain = promiseChain.then(() => composer.addTransaction(txn, signer));
                return this;
            },
            async composer() {
                await promiseChain;
                return composer;
            },
            async simulate(options) {
                await promiseChain;
                const result = await (!options ? composer.simulate() : composer.simulate(options));
                return {
                    ...result,
                    returns: result.returns?.map((val, i) => resultMappers[i] !== undefined ? resultMappers[i](val) : val.returnValue)
                };
            },
            async send(params) {
                await promiseChain;
                const result = await composer.send(params);
                return {
                    ...result,
                    returns: result.returns?.map((val, i) => resultMappers[i] !== undefined ? resultMappers[i](val) : val.returnValue)
                };
            }
        };
    }
}
