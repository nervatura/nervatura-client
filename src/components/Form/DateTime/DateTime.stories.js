import { DateTime } from "./DateTime";
import { formatISO } from 'date-fns'

export default {
  title: "Form/DateTime",
  component: DateTime
}

const Template = (args) => <DateTime {...args} />

export const Default = Template.bind({});
Default.args = {
  className: "light",
  value: formatISO(new Date()),
  placeholder: undefined,
  dateTime: true,
  isEmpty: true,
  showTimeSelectOnly: false,
}

export const DateInput = Template.bind({});
DateInput.args = {
  ...Default.args,
  className: "dark",
  value: formatISO(new Date(), { representation: 'date' }),
  dateTime: false,
  isEmpty: false,
}

export const TimeInput = Template.bind({});
TimeInput.args = {
  ...Default.args,
  value: formatISO(new Date(), { representation: 'time' }),
  showTimeSelectOnly: true,
}

export const Placeholder = Template.bind({});
Placeholder.args = {
  ...Default.args,
  value: null,
  placeholder: "placeholder value",
}