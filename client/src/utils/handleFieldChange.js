export default function handleFieldChange(field) {
  return (event) => {
    const newState = {};
    newState[field] = event.target.value;
    this.setState(newState);
  };
}
