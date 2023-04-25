import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const Clock = (timestamp) => {
  const [currentTime, setCurrentTime] = useState(null);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now() - timestamp.timestamp);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (time, offset) => {
    const adjustedTime = time-offset
    const seconds = Math.floor(adjustedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h late`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m late`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s late`;
    } else if (seconds > 0){
      return `${seconds}s late`;
    } else if (minutes < 0){
      return `${-minutes}m ${-seconds % 60}s remain`;
    } else {
      return `${-seconds}s remain`;
    }
  };

  return (
    <View>
      <Text>{formatTime(currentTime, 300000)}</Text>
    </View>
  );
};

export default Clock;
