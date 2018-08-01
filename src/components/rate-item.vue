<template>
  <div class="row item">
    <div class="col-md-10 col-xs-8 item-detail">
      <h4>
        {{ rateItem.item }}
        <br>
        <small class="text-muted" v-if="rateItem.note">{{ rateItem.note }}</small>
        <small v-if="rateItem.contributor" class="text-muted">
          <i class="fa fa-user" aria-hidden="true"></i> 
          本通路由 {{ rateItem.contributor }} 提供
        </small>
      </h4>
    </div>
    <div
      :class="[
        'col-md-2',
        'col-xs-4',
        'item-type',
        getRateDescription(rateItem.rate).rateClass]"
    >
      <h4 class="white text">
        <span style="font-size: 1.5em">{{getRateDescription(rateItem.rate).rateNumber}}</span>
        <br>
        <small class="white text">{{getRateDescription(rateItem.rate).rateText}}</small>
      </h4>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RateItem',
  props: {
    rateItem: Object,
  },
  methods: {
    getRateDescription(rate) {
      const isBonus = rate > 0;
      let rateClass = '';
      let rateText = '';
      let rateNumber = '';

      rateClass = isBonus ? 'bonus' : 'no-rebate';
      rateText = isBonus ? '指定通路加碼' : '無現金回饋';
      rateNumber = (rate * 100).toString() + '%';

      return { rateClass, rateText, rateNumber };
    }
  }
};
</script>

<style lang="scss" scope>
  .text.white {
    color: #ffffff;
  }

  .item {
    margin-bottom: 15px;
    background: #f8f8f8;
    border-radius: 4px;
    font-size: 1.1em;
  }

  .item-type {
    padding: 15px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;

    &.bonus {
      background: #59c3c3;
    }

    &.no-rebate {
    background: #f45b69;
    }
  }

  .item-detail {
    padding: 25px 15px 15px 30px;
  }

</style>
