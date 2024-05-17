import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Filters = ({ onChange, selections, sections }) => {
  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            onChange(index);
          }}
          style={{
            flex: 1 / sections.length,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
            backgroundColor: selections[index] ? '#EE9972' : '#495E57', //pink-peachy: #EE9972
            borderWidth: 1,
            borderRadius: 26,
            borderColor: 'white',
          }}>
          <View>
            <Text style={{ color: selections[index] ? 'black' : 'white' }}>
              {section}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    //backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default Filters;