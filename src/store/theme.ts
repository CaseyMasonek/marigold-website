import {atom} from "nanostores";

type Theme = "theme-light"|"dark"|"system"

export const $theme = atom<Theme>("system")

export function setTheme(theme: Theme) {
    $theme.set(theme)
}