<template>
  <div>
    <div
      v-if="items.length > 0"
      v-for="(item, key) in items"
      :key="key"
    >
      <list-item :item="item"></list-item>
    </div>
  </div>
</template>

<script>
import ListItem from '../components/list-item.vue';
import items from '../../lib/rate.js';
import '../../node_modules/font-awesome/css/font-awesome.min.css';

export default {
  name: 'list',
  data() {
    return {
      items
    }
  },
  components: { ListItem }
}
</script>

