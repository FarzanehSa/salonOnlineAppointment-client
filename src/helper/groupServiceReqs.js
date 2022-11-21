const helper = (arr, result) => {

  if (result.length === 0) {
    for (const e of arr) {
      result.push([e])
    } 
    return result;
  }

  const temp = []
  for (let i = 0; i < result.length; i++) {
    for (const e of arr) {
      if (e.timeAv.length !== 0) {
        temp.push([...result[i], e])
      }
    }
  }
  return temp
}

const groupServiceReqs = (arr) => {
  let result = [];
  const notValid = arr.filter(task => task.length === 0).length
  if (notValid) return result;

  for (const e of arr) {
    result = helper(e, result)
    // console.log('💇🏻‍♀️',result);
  }
  return result;
}

module.exports = {groupServiceReqs};