const sanitize = (value) => {
    return String(value).replace(/&/g, '&lt;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, "&#x27;");
}

// モジュールとしてエクスポート
module.exports = sanitize;