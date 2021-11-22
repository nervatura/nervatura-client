import { Paginator } from "./Paginator";

export default {
  title: "Form/Paginator",
  component: Paginator
}

const Template = (args) => <Paginator {...args} />

export const Default = Template.bind({});
Default.args = {
  pagination: {
    page: 1
  },
  pages: 3,
}

export const Max = Template.bind({});
Max.args = {
  ...Default.args,
  pages: 30,
}