const ICONS = {};

function QuteMaterialIcon(rendering, attrs, slots) {
    const IconTemplate = ICONS[attrs.name];
    if (!IconTemplate) {
        throw new Error('Unknown qute material icon: '+attrs.name);
    }
    return rendering._c(IconTemplate, attrs, slots);
}
QuteMaterialIcon.add = function(name, IconTemplate) {
    ICONS[name] = IconTemplate;
}
export default QuteMaterialIcon;
