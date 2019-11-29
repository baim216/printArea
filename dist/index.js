(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (global.index = global.index || {}, global.index.js = factory()));
}(this, function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var PrintArea =
  /*#__PURE__*/
  function () {
    function PrintArea(ele, options) {
      _classCallCheck(this, PrintArea);

      this.counter = 0;
      this.modes = {
        iframe: "iframe",
        popup: "popup"
      };
      this.standards = {
        strict: "strict",
        loose: "loose",
        html5: "html5"
      };
      var defaults = {
        mode: this.modes.iframe,
        standard: this.standards.html5,
        popHt: 500,
        popWd: 400,
        popX: 200,
        popY: 200,
        popTitle: '',
        popClose: true,
        extraCss: '',
        extraHead: '',
        retainAttr: ["id", "class", "style"]
      };
      this.settings = Object.assign({}, defaults, options);
      this.idPrefix = "printArea_";
      this.ele = ele.nodeType === 1 ? ele : document.querySelector(ele);
    }

    _createClass(PrintArea, [{
      key: "print",
      value: function print() {
        var _this = this;

        this.counter++;
        var prefixList = document.querySelectorAll("[id^=" + this.idPrefix + "]");

        while (prefixList.length) {
          prefixList[0].parentNode.removeChild(prefixList[0]);
          prefixList = document.querySelectorAll("[id^=" + this.idPrefix + "]");
        }

        this.settings.id = this.idPrefix + this.counter;
        var PrintAreaWindow = this.getPrintWindow();
        this.write(PrintAreaWindow.doc, this.ele);
        setTimeout(function () {
          _this.windowPrint(PrintAreaWindow);
        }, 1000);
      }
    }, {
      key: "windowPrint",
      value: function windowPrint(PAWindow) {
        var paWindow = PAWindow.win;
        paWindow.focus();
        paWindow.print();

        if (this.settings.mode === this.modes.popup && this.settings.popClose) {
          setTimeout(function () {
            paWindow.close();
          }, 1000);
        }
      }
    }, {
      key: "write",
      value: function write(PADocument, element) {
        PADocument.open();
        PADocument.write(this.docType() + "<html>" + this.getHead() + this.getBody(element) + "</html>");
        PADocument.close();
      }
    }, {
      key: "docType",
      value: function docType() {
        if (this.settings.mode === this.modes.iframe) {
          return "";
        }

        if (this.settings.standard === this.standards.html5) {
          return "<!DOCTYPE html>";
        }

        var transitional = this.settings.standard === this.standards.loose ? " Transitional" : "";
        var dtd = this.settings.standard === this.standards.loose ? "loose" : "strict";
        return '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01' + transitional + '//EN" "http://www.w3.org/TR/html4/' + dtd + '.dtd">';
      }
    }, {
      key: "getHead",
      value: function getHead() {
        var extraHead = "";

        if (this.settings.extraHead) {
          this.settings.extraHead.replace(/([^,]+)/g, function (m) {
            extraHead += m;
          });
        }

        var linkList = document.querySelectorAll('link');
        linkList = Array.from(linkList).filter(function (item) {
          var relAttr = item.getAttribute("rel");
          return relAttr && relAttr.toLowerCase() === 'stylesheet';
        }).filter(function (item) {
          var mediaAttr = item.getAttribute("media");
          return !mediaAttr || mediaAttr.toLowerCase() === 'print' || mediaAttr.toLowerCase() === 'all';
        }).map(function (item) {
          var href = item.getAttribute("href");
          return "<link type=\"text/css\" rel=\"stylesheet\" href=\"".concat(href, "\" >");
        });

        if (this.settings.extraCss) {
          this.settings.extraCss.replace(/([^,\s]+)/g, function (m) {
            extraHead += '<link type="text/css" rel="stylesheet" href="' + m + '">';
          });
        }

        return "<head><title>" + this.settings.popTitle + "</title>" + extraHead + linkList.join("") + "</head>";
      }
    }, {
      key: "getBody",
      value: function getBody(element) {
        var html = "";
        var attrs = this.settings.retainAttr;
        var ele = this.getFormData(element);
        var attributes = "";
        attrs.forEach(function (attr) {
          var eleAttr = ele.getAttribute(attr);

          if (eleAttr) {
            attributes += (attributes.length > 0 ? " " : "") + attr + "='" + eleAttr + "'";
          }
        });
        html += '<div ' + attributes + '>' + ele.innerHTML + '</div>';
        return "<body>" + html + "</body>";
      }
    }, {
      key: "getFormData",
      value: function getFormData(ele) {
        var copy = ele.cloneNode(true);
        var copiedInputs = copy.querySelectorAll("input,select,textarea");
        Array.from(ele.querySelectorAll("input,select,textarea")).forEach(function (item, index) {
          var typeInput = item.getAttribute("type");

          if (!typeInput) {
            var targetName = item.nodeName;
            typeInput = targetName === 'SELECT' ? "select" : targetName === 'TEXTAREA' ? "textarea" : "";
          }

          var copiedInput = copiedInputs[index];

          if (typeInput === "radio" || typeInput === "checkbox") {
            copiedInput.removeAttribute('checked');

            if (item.checked) {
              copiedInput.setAttribute('checked', true);
            }
          } else if (typeInput === "text" || typeInput === "") {
            copiedInput.setAttribute("value", item.textContent);
          } else if (typeInput === "select") {
            var options = item.querySelectorAll('option');
            var copiedOptions = copiedInput.querySelectorAll('option');
            Array.from(options).forEach(function (option, optionIndex) {
              copiedOptions[optionIndex].removeAttribute('selected');

              if (option.selected) {
                copiedOptions[optionIndex].setAttribute('selected', true);
              }
            });
          } else if (typeInput === "textarea") {
            copiedInput.textContent = item.value;
          }
        });
        return copy;
      }
    }, {
      key: "getPrintWindow",
      value: function getPrintWindow() {
        switch (this.settings.mode) {
          case this.modes.iframe:
            var f = this.Iframe();
            return {
              win: f.contentWindow || f,
              doc: f.doc
            };

          case this.modes.popup:
            var p = this.Popup();
            return {
              win: p,
              doc: p.doc
            };
        }
      }
    }, {
      key: "Iframe",
      value: function Iframe() {
        var frameId = this.settings.id;
        var iframeStyle = 'border:0;position:absolute;width:0px;height:0px;right:0px;top:0px;';
        var iframe;

        try {
          iframe = document.createElement('iframe');
          document.body.appendChild(iframe);
          iframe.setAttribute('style', iframeStyle);
          iframe.setAttribute('id', frameId);
          iframe.setAttribute('src', "#" + new Date().getTime());
          iframe.doc = null;
          iframe.doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow ? iframe.contentWindow.document : iframe.document;
        } catch (e) {
          throw e + ". iframes may not be supported in this browser.";
        }

        if (iframe.doc == null) throw "Cannot find document.";
        return iframe;
      }
    }, {
      key: "Popup",
      value: function Popup() {
        var windowAttr = "location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";
        windowAttr += ",width=" + this.settings.popWd + ",height=" + this.settings.popHt;
        windowAttr += ",resizable=yes,screenX=" + this.settings.popX + ",screenY=" + this.settings.popY + ",personalbar=no,scrollbars=yes";
        var newWin = window.open("", "_blank", windowAttr);
        newWin.doc = newWin.document;
        return newWin;
      }
    }]);

    return PrintArea;
  }();
  window.PrintArea = PrintArea;

  return PrintArea;

}));
