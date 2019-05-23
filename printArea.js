export  default class PrintArea {
  constructor(ele, options) {
    this.counter = 0;
    this.modes = {iframe: "iframe", popup: "popup"};
    this.standards = {strict: "strict", loose: "loose", html5: "html5"};
    const defaults = {
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

    this.settings = {
      ...defaults,
      ...options,
    };

    this.idPrefix = "printArea_";

    this.ele = this.isElement(ele) ? ele : document.querySelector(ele);
  }

  print() {
    this.counter ++;

    let prefixList = document.querySelectorAll( "[id^=" + this.idPrefix + "]" );

    while(prefixList.length){
      prefixList[0].parentNode.removeChild(prefixList[0]);
      prefixList = document.querySelectorAll( "[id^=" + this.idPrefix + "]" );
    }

    this.settings.id = this.idPrefix + this.counter;

    const PrintAreaWindow = this.getPrintWindow();

    this.write( PrintAreaWindow.doc, this.ele );

    setTimeout( () => { this.windowPrint( PrintAreaWindow ); }, 1000 );
  }

  windowPrint(PAWindow) {
    const paWindow = PAWindow.win;
    paWindow.focus();
    paWindow.print();

    if ( this.settings.mode === this.modes.popup && this.settings.popClose ){
      setTimeout(() => { paWindow.close(); }, 1000);
    }
  }

  write( PADocument, element ) {
    PADocument.open();
    PADocument.write( this.docType() + "<html>" + this.getHead() + this.getBody( element ) + "</html>" );
    PADocument.close();
  }

  docType() {
    if ( this.settings.mode === this.modes.iframe ) { return "" }

    if ( this.settings.standard === this.standards.html5 ) { return "<!DOCTYPE html>" }

    const transitional = this.settings.standard === this.standards.loose ? " Transitional" : "";
    const dtd = this.settings.standard === this.standards.loose ? "loose" : "strict";

    return '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01' + transitional + '//EN" "http://www.w3.org/TR/html4/' + dtd +  '.dtd">';
  }

  getHead() {
    let extraHead = "";

    if ( this.settings.extraHead ) {
      this.settings.extraHead.replace( /([^,]+)/g, function(m){ extraHead += m })
    }

    let linkList = document.querySelectorAll('link');

    linkList = Array.from(linkList)
      .filter((item) => {
      const relAttr = item.getAttribute("rel");
      return relAttr && relAttr.toLowerCase() === 'stylesheet';
    })
      .filter((item) => {
        const mediaAttr = item.getAttribute("media");
        return !mediaAttr || mediaAttr.toLowerCase() === 'print' || mediaAttr.toLowerCase() === 'all'
      })
      .map((item) => {
        const href = item.getAttribute("href");
        return `<link type="text/css" rel="stylesheet" href="${href}" >`
      });

    if ( this.settings.extraCss ) {
      this.settings.extraCss.replace( /([^,\s]+)/g, function(m){ extraHead += '<link type="text/css" rel="stylesheet" href="' + m + '">' });
    }

    return "<head><title>" + this.settings.popTitle + "</title>" + extraHead + linkList.join() + "</head>";
  }

  getBody ( element ) {
    let html = "";
    const attrs = this.settings.retainAttr;
    const ele = this.getFormData( element );

    let attributes = "";

    attrs.forEach(attr => {
      const eleAttr = ele.getAttribute( attr );
      if ( eleAttr ) {
        attributes += (attributes.length > 0 ? " ":"") + attr + "='" + eleAttr + "'";
      }
    });

    html += '<div ' + attributes + '>' + ele.innerHTML + '</div>';

    return "<body>" + html + "</body>";
  }

  getFormData( ele ) {
    const copy = ele.cloneNode(true);
    const copiedInputs = copy.querySelectorAll("input,select,textarea");

    Array.from(copy.querySelectorAll("input,select,textarea")).forEach((item, index) => {
      let typeInput = item.getAttribute("type");
      if (!typeInput) {
        const targetName = item.nodeName;
        typeInput = targetName === 'SELECT' ? "select" : targetName === 'TEXTAREA' ? "textarea" : "";
      }
      let copiedInput = copiedInputs[index];

      if ( typeInput === "radio" || typeInput === "checkbox" ) {
        copiedInput.setAttribute( "checked", item.checked );
      } else if ( typeInput === "text" || typeInput === "" ) {
        copiedInput.setAttribute( "value", item.textContent );
      } else if ( typeInput === "select" ){
        const options = item.querySelectorAll('option');
        Array.from(options).forEach(option => {
          if ( option.selected ) {
            option.setAttribute('selected', true);
          }
        });
      } else if ( typeInput === "textarea" ) {
        copiedInput.textContent = item.value;
      }
    });
    return copy;
  }

  getPrintWindow() {
    switch ( this.settings.mode ) {
      case this.modes.iframe :
        const f = this.Iframe();
        return { win : f.contentWindow || f, doc : f.doc };
      case this.modes.popup :
        const p = this.Popup();
        return { win : p, doc : p.doc };
    }
  }

  Iframe() {
    const frameId = this.settings.id;
    const iframeStyle = 'border:0;position:absolute;width:0px;height:0px;right:0px;top:0px;';
    let iframe;

    try
    {
      iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      iframe.setAttribute('style', iframeStyle);
      iframe.setAttribute('id', frameId);
      iframe.setAttribute('src', "#" + new Date().getTime());
      iframe.doc = null;
      iframe.doc = iframe.contentDocument ? iframe.contentDocument : ( iframe.contentWindow ? iframe.contentWindow.document : iframe.document);
    }
    catch( e ) { throw e + ". iframes may not be supported in this browser."; }

    if ( iframe.doc == null ) throw "Cannot find document.";

    return iframe;
  }

  Popup () {
    let windowAttr = "location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";
    windowAttr += ",width=" + this.settings.popWd + ",height=" + this.settings.popHt;
    windowAttr += ",resizable=yes,screenX=" + this.settings.popX + ",screenY=" + this.settings.popY + ",personalbar=no,scrollbars=yes";

    const newWin = window.open( "", "_blank",  windowAttr );

    newWin.doc = newWin.document;

    return newWin;
  }

  isElement(el) {
    return el.nodeType === 1;
  }

}
