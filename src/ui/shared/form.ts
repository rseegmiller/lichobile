import i18n from '../../i18n'
import redraw from '../../utils/redraw'
import * as h from 'mithril/hyperscript'
import { StoredProp } from '../../storage'

type SelectOption = string[]
type SelectOptionGroup = Array<SelectOption>

type LichessPropOption = [number, string, string | undefined]

export default {

  renderRadio(
    label: string,
    name: string,
    value: string,
    checked: boolean,
    onchange: (e: Event) => void,
    disabled?: boolean
  ) {
    const id = name + '_' + value
    return [
      h('input.radio[type=radio]', {
        name,
        id,
        className: value,
        value,
        checked,
        onchange,
        disabled
      }),
      h('label', {
        'for': id
      }, i18n(label))
    ]
  },

  renderSelect(
    label: string,
    name: string,
    options: Array<SelectOption>,
    settingsProp: StoredProp<string>,
    isDisabled?: boolean,
    onChangeCallback?: (v: string) => void
  ) {
    const prop = settingsProp()
    return [
      h('label', {
        'for': 'select_' + name
      }, i18n(label)),
      h('select', {
        id: 'select_' + name,
        disabled: isDisabled,
        onchange(e: Event) {
          const val = (e.target as HTMLSelectElement).value
          settingsProp(val)
          if (onChangeCallback) onChangeCallback(val)
          setTimeout(redraw, 10)
        }
      }, options.map(e => renderOption(e[0], e[1], prop, e[2], e[3])))
    ]
  },

  renderLichessPropSelect(
    label: string,
    name: string,
    options: Array<LichessPropOption>,
    settingsProp: StoredProp<number>,
    isDisabled?: boolean
  ) {
    const prop = settingsProp()
    return [
      h('label', {
        'for': 'select_' + name
      }, i18n(label)),
      h('select', {
        id: 'select_' + name,
        disabled: isDisabled,
        onchange(e: Event) {
          const val = (e.target as HTMLSelectElement).value
          settingsProp(~~val)
        }
      }, options.map(e => renderLichessPropOption(e[1], e[0], prop, e[2])))
    ]
  },

  renderCheckbox(
    label: string,
    name: string,
    settingsProp: StoredProp<boolean>,
    callback?: (v: boolean) => void,
    disabled?: boolean
  ) {
    const isOn = settingsProp()
    return h('div.check_container', {
      className: disabled ? 'disabled' : ''
    }, [
      h('label', {
        'for': name
      }, label),
      h('input[type=checkbox]', {
        name: name,
        disabled,
        checked: isOn,
        onchange: function() {
          const newVal = !isOn
          settingsProp(newVal)
          if (callback) callback(newVal)
          redraw()
        }
      })
    ])
  },

  renderSelectWithGroup(
    label: string,
    name: string,
    options: Array<Array<string | SelectOptionGroup>>,
    settingsProp: StoredProp<string>,
    isDisabled?: boolean,
    onChangeCallback?: (v: string) => void
  ) {
    const prop = settingsProp()
    return [
      h('label', {
        'for': 'select_' + name
      }, i18n(label)),
      h('select', {
        id: 'select_' + name,
        disabled: isDisabled,
        onchange(e: Event) {
          const val = (e.target as HTMLSelectElement).value
          settingsProp(val)
          if (onChangeCallback) onChangeCallback(val)
          setTimeout(() => redraw(), 10)
        }
      }, options.map(e => renderOptionGroup(e[0] as string, e[1], prop, e[2] as string, e[3] as string)))
    ]
  },

  renderSlider(
    label: string,
    name: string,
    min: number,
    max: number,
    step: number,
    prop: StoredProp<number>,
    onChange: (v: number) => void
  ) {
    const value = prop()
    return h('div.forms-rangeSlider', [
      h('label', { 'for': name }, label),
      h('input[type=range]', {
        id: name,
        value,
        min,
        max,
        step,
        oninput(e: Event) {
          const val = (e.target as HTMLInputElement).value
          const nval = ~~val
          prop(nval)
          onChange(nval)
          setTimeout(redraw, 10)
        }
      }),
      h('div.forms-sliderValue', value + ' / ' + max)
    ])
  }
}

function renderOption(label: string, value: string, prop: string, labelArg?: string, labelArg2?: string) {
  const l = labelArg && labelArg2 ? i18n(label, labelArg, labelArg2) :
    labelArg ? i18n(label, labelArg) : i18n(label)
  return h('option', {
    key: value,
    value,
    selected: prop === value
  }, l)
}

function renderLichessPropOption(label: string, value: number, prop: number, labelArg?: string) {
  const l = labelArg ? i18n(label, labelArg) : i18n(label)
  return h('option', {
    key: value,
    value,
    selected: prop === value
  }, l)
}


function renderOptionGroup(label: string, value: string | SelectOptionGroup, prop: string, labelArg: string, labelArg2: string): Mithril.Children {
  if (typeof value === 'string') {
    return renderOption(label, value, prop, labelArg, labelArg2)
  }
  else {
    return h('optgroup', {
      key: label,
      label
    }, value.map(e => renderOption(e[0], e[1], prop, e[2], e[3])))
  }
}
