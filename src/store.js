
const instances = new Map();

function createInstance(activityID) {
  if (!instances.has(activityID)) {
    instances.set(activityID, { activityID, createdAt: new Date().toISOString(), students: new Map() });
  }
  return instances.get(activityID);
}

function getInstance(activityID) {
  return instances.get(activityID) || null;
}

module.exports = { createInstance, getInstance };
