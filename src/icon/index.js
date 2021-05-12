import QuteMaterialIcon from '../icons';

const PROVIDERS = {
    qm: QuteMaterialIcon
};
let DEFAULT_PROVIDER = null;

function mIcon(rendering, attrs, slots) {
    // normalize attributes
    let name = attrs && attrs.name;
    if (!name) {
        if (slots && slots.default) {
            name = slots.default[0].textContent.trim();
            if (!attrs) attrs = {};
            attrs.name = name;
        }
    } else {
        name = rendering.eval(name);
    }
    if (attrs) {
        if (!attrs.size) {
            if (attrs.small) {
                attrs.size = 'small';
            } else if (attrs.large) {
                attrs.size = 'large';
            } else if (attrs.xlarge) {
                attrs.size = 'xlarge';
            } else if (attrs.normal) {
                attrs.size = 'normal';
            }
        }
        if (!attrs.theme) {
            if (attrs.dark) {
                attrs.theme = 'dark';
            } else if (attrs.light) {
                attrs.theme = 'light';
            }
        }
    }
    // look into providers if needed
    const i = name.indexOf(':');
    if (i > -1) {
        attrs.name = name.substring(i + 1);
        const provider = PROVIDERS[name.substring(0, i)];
        if (provider) {
            return provider(rendering, attrs, slots);
        } else {
            throw new Error('No icon provider was registered for: '+name.substring(0, i));
        }
    }

    if (DEFAULT_PROVIDER) {
        return DEFAULT_PROVIDER(rendering, attrs, slots);
    } else {
        throw new Error('No default icon provider was registeerd!');
    }
}

mIcon.add = function (prefix, provider, isDefault) {
    PROVIDERS[prefix] = provider;
    if (isDefault) DEFAULT_PROVIDER = provider;
}
mIcon.setDefault = function (provider) {
    DEFAULT_PROVIDER = provider;
}
export { mIcon };
