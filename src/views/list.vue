<template>
  <div>
    <rate-item
      v-if="items.length > 0"
      v-for="(item, key) in items"
      :key="key"
      :rate-item="item"
    >
    </rate-item>
  </div>
</template>

<script>
import RateItem from '../components/rate-item.vue';
import items from '../../lib/rate.js';

export default {
  name: 'list',
  data() {
    return {
      items
    }
  },
  components: { RateItem }
}
</script>

<style scope>
  @import '../../node_modules/font-awesome/css/font-awesome.min.css';
</style>
