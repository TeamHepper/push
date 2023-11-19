export function timing(holderClaimTime: any) {
  const currentDate = new Date();
  const CurrentTimestamp = currentDate.getTime();

  const dateT = new Date(holderClaimTime * 1000);
  const getTime = dateT.getTime();

  const value = getTime - CurrentTimestamp;

  return value;
}
