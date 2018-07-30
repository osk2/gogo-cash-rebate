<template>
  <div class="row">
    <div class="hidden-sm hidden-xs col-md-6">
      <img src="../../public/img/richart-standby.png">
    </div>
    <form class="col-md-6">
      <div class="form-group">
        <label>@GoGo明細</label>
        <input name="xls" type="file" class="form-control" accept="application/vnd.ms-excel" required>
        <p class="help-block">匯入 Richart 消費明細</p>
      </div>
      <div class="form-group">
        <label>起始</label>
        <input name="start" type="number" class="form-control" value="0">
      </div>
      <div class="form-group">
        <label>結束</label>
        <input name="end" type="number" class="form-control" value="23">
      </div>
      <button type="submit" class="btn btn-primary">分析</button>
    </form>
  </div>
</template>

<script>

export default {
  name: 'home',
};
</script>
