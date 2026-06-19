/*
 * TermuxHub Button Utilities
 */

window.ButtonComponent = {
    render: function(label, type = "primary", id = "") {
        const idAttr = id ? `id="${id}"` : "";
        const classNames = type === "glass" ? "btn btn-glass" : "btn btn-primary";
        return `<button ${idAttr} class="${classNames}">${label}</button>`;
    }
};
