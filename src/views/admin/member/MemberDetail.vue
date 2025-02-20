<template>
  <div class="space-y-4 p-4 bg-gray-50 min-h-screen">
    <!-- 会员详情卡片 -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="p-4 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-medium flex items-center gap-3">
            <font-awesome-icon icon="user" class="text-blue-600" />
            会员详情
          </h2>
          <div class="flex items-center gap-3">
            <button
              class="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              @click="router.back()"
            >
              <font-awesome-icon icon="arrow-left" />
              <span>返回会员列表</span>
            </button>
            <button
              class="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
              @click="handleEdit"
              v-if="!isEditing"
            >
              <font-awesome-icon icon="edit" />
              <span>编辑信息</span>
            </button>
            <template v-else>
              <button
                class="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                @click="handleCancel"
              >
                <font-awesome-icon icon="times" />
                <span>取消</span>
              </button>
              <button
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                @click="handleSave"
              >
                <font-awesome-icon icon="check" />
                <span>保存</span>
              </button>
            </template>
          </div>
        </div>
      </div>

      <div class="p-4">
        <div class="space-y-4">
          <!-- 基本信息 -->
          <div class="bg-white rounded-xl p-3 border border-gray-100">
            <h3 class="text-lg font-medium flex items-center gap-2 text-gray-800 mb-3">
              <font-awesome-icon icon="info-circle" class="text-blue-600" />
              基本信息
            </h3>
            <div class="space-y-3">
              <!-- 头像和姓名区域 -->
              <div class="flex items-start gap-3 p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl">
                <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
                  <font-awesome-icon icon="user" class="text-3xl text-white" />
                </div>
                <div class="flex-1 pt-0.5">
                  <template v-if="!isEditing">
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="text-xl font-semibold text-gray-900">{{ memberInfo.name }}</div>
                        <div class="flex items-center gap-2 mt-1.5">
                          <span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            ID: {{ memberInfo.id }}
                          </span>
                          <span class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                            积分: {{ memberInfo.points }}
                          </span>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="px-2.5 py-1.5 bg-orange-50 rounded-lg">
                          <div class="text-xs text-orange-600 mb-0.5">可提取商品</div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ memberInfo.products.reduce((total, product) => total + product.quantity, 0) }} 件
                          </div>
                        </div>
                        <div class="px-2.5 py-1.5 bg-purple-50 rounded-lg">
                          <div class="text-xs text-purple-600 mb-0.5">商品总积分</div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ memberInfo.products.reduce((total, product) => total + product.points * product.quantity, 0) }} 分
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <el-input v-model="editForm.name" placeholder="会员姓名" class="!mb-2" />
                  </template>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-3">
                  <div class="grid grid-cols-2 gap-3">
                    <div class="bg-gray-50 rounded-lg p-2.5">
                      <div class="text-xs text-gray-500 mb-1">IC卡号</div>
                      <template v-if="!isEditing">
                        <div class="font-medium text-gray-900">{{ memberInfo.cardNo }}</div>
                      </template>
                      <template v-else>
                        <div class="flex gap-2">
                          <el-input v-model="editForm.cardNo" placeholder="IC卡号" disabled />
                          <button
                            class="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                            @click="handleReadCard"
                          >
                            <font-awesome-icon icon="id-card" />
                            <span>读卡</span>
                          </button>
                        </div>
                      </template>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-2.5">
                      <div class="text-xs text-gray-500 mb-1">卡面号</div>
                      <template v-if="!isEditing">
                        <div class="font-medium text-gray-900">{{ memberInfo.physicalNo }}</div>
                      </template>
                      <template v-else>
                        <el-input v-model="editForm.physicalNo" placeholder="卡面号" disabled />
                      </template>
                    </div>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-2.5">
                    <div class="text-xs text-gray-500 mb-1">手机号</div>
                    <template v-if="!isEditing">
                      <div class="font-medium text-gray-900">{{ memberInfo.phone }}</div>
                    </template>
                    <template v-else>
                      <el-input v-model="editForm.phone" placeholder="手机号" />
                    </template>
                  </div>
                  <div class="grid grid-cols-3 gap-3">
                    <div class="bg-gray-50 rounded-lg p-2.5">
                      <div class="text-xs text-gray-500 mb-1">注册时间</div>
                      <div class="font-medium text-gray-900">{{ memberInfo.registerDate }}</div>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-2.5">
                      <div class="text-xs text-gray-500 mb-1">所属店铺</div>
                      <template v-if="!isEditing">
                        <div class="font-medium text-gray-900">{{ memberInfo.registerStore }}</div>
                      </template>
                      <template v-else>
                        <el-select v-model="editForm.registerStore" placeholder="选择店铺" class="!w-full">
                          <el-option
                            v-for="store in stores"
                            :key="store"
                            :label="store"
                            :value="store"
                          />
                        </el-select>
                      </template>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-2.5">
                      <div class="text-xs text-gray-500 mb-1">最后活跃</div>
                      <div class="font-medium text-gray-900">{{ memberInfo.lastActive }}</div>
                    </div>
                  </div>
                </div>
                <div class="space-y-3">
                  <div>
                    <div class="text-sm text-gray-700 mb-2 flex items-center gap-2">
                      <font-awesome-icon icon="credit-card" class="text-blue-600" />
                      IC卡照片
                    </div>
                    <div class="grid grid-cols-2 gap-3 max-w-[700px]">
                      <div class="space-y-1">
                        <div class="aspect-[1.586/1] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                          <el-image
                            :src="memberInfo.cardFrontImage || ''"
                            fit="cover"
                            class="w-full h-full"
                          >
                            <template #error>
                              <div class="w-full h-full flex flex-col items-center justify-center">
                                <font-awesome-icon icon="credit-card" class="text-gray-400 text-2xl mb-1" />
                                <span class="text-xs text-gray-400">暂无正面照片</span>
                              </div>
                            </template>
                          </el-image>
                        </div>
                        <div v-if="isEditing" class="flex justify-center">
                          <el-upload
                            class="upload-demo"
                            action="#"
                            :auto-upload="false"
                            :show-file-list="false"
                            accept="image/*"
                            :on-change="(file: UploadFile) => handleImageChange(file, 'front')"
                          >
                            <el-button type="primary" class="!bg-blue-500 hover:!bg-blue-600 !rounded-lg !text-sm">
                              <font-awesome-icon icon="upload" class="mr-1" />
                              上传正面照片
                            </el-button>
                          </el-upload>
                        </div>
                      </div>
                      <div class="space-y-1">
                        <div class="aspect-[1.586/1] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                          <el-image
                            :src="memberInfo.cardBackImage || ''"
                            fit="cover"
                            class="w-full h-full"
                          >
                            <template #error>
                              <div class="w-full h-full flex flex-col items-center justify-center">
                                <font-awesome-icon icon="credit-card" class="text-gray-400 text-2xl mb-1" />
                                <span class="text-xs text-gray-400">暂无背面照片</span>
                              </div>
                            </template>
                          </el-image>
                        </div>
                        <div v-if="isEditing" class="flex justify-center">
                          <el-upload
                            class="upload-demo"
                            action="#"
                            :auto-upload="false"
                            :show-file-list="false"
                            accept="image/*"
                            :on-change="(file: UploadFile) => handleImageChange(file, 'back')"
                          >
                            <el-button type="primary" class="!bg-blue-500 hover:!bg-blue-600 !rounded-lg !text-sm">
                              <font-awesome-icon icon="upload" class="mr-1" />
                              上传背面照片
                            </el-button>
                          </el-upload>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 积分和商品信息区域 -->
          <div class="grid grid-cols-2 gap-4">
            <!-- 积分信息 -->
            <div class="bg-white rounded-xl p-4 border border-gray-100">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium flex items-center gap-2 text-gray-800">
                  <font-awesome-icon icon="chart-pie" class="text-blue-600" />
                  积分信息
                </h3>
                <button
                  v-if="isEditing"
                  class="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm"
                  @click="showAdjustPointsDialog = true"
                >
                  <font-awesome-icon icon="coins" />
                  <span>调整积分</span>
                </button>
              </div>
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-blue-50 rounded-xl p-4">
                    <div class="text-sm text-blue-600">累计积分</div>
                    <div class="text-2xl font-bold mt-2">{{ memberInfo.totalPoints }}</div>
                  </div>
                  <div class="bg-green-50 rounded-xl p-4">
                    <div class="text-sm text-green-600">当前积分</div>
                    <div class="text-2xl font-bold mt-2">{{ memberInfo.points }}</div>
                  </div>
                  <div class="bg-purple-50 rounded-xl p-4">
                    <div class="text-sm text-purple-600">消费次数</div>
                    <div class="text-2xl font-bold mt-2">{{ memberInfo.orderCount }}</div>
                  </div>
                  <div class="bg-orange-50 rounded-xl p-4">
                    <div class="text-sm text-orange-600">平均单次消费积分</div>
                    <div class="text-2xl font-bold mt-2">{{ Math.round(memberInfo.totalPoints / memberInfo.orderCount) }}</div>
                  </div>
                </div>

                <!-- 积分记录 -->
                <div class="overflow-x-auto">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-800">积分记录</h4>
                  </div>
                  <div class="max-h-[240px] overflow-y-auto">
                    <table class="w-full">
                      <thead class="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单编号</th>
                          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">获得积分</th>
                          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">消费积分</th>
                          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">消费时间</th>
                          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">消费门店</th>
                          <th v-if="isEditing" class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="order in memberInfo.orders" :key="order.id" class="hover:bg-gray-50">
                          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ order.id }}</td>
                          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ order.points }}</td>
                          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ order.usedPoints }}</td>
                          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ order.date }}</td>
                          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ order.store }}</td>
                          <td v-if="isEditing" class="px-4 py-3 whitespace-nowrap text-right text-sm">
                            <button
                              class="text-red-600 hover:text-red-700 transition-colors"
                              @click="handleDeleteRecord(order)"
                            >
                              <font-awesome-icon icon="trash" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- 商品信息 -->
            <div class="bg-white rounded-xl p-4 border border-gray-100">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-medium flex items-center gap-2 text-gray-800">
                  <font-awesome-icon icon="box-open" class="text-blue-600" />
                  商品信息
                </h3>
                <button
                  v-if="isEditing"
                  class="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm"
                  @click="showAddProductDialog = true"
                >
                  <font-awesome-icon icon="plus" />
                  <span>添加商品</span>
                </button>
              </div>
              <div class="space-y-4">
                <!-- 会员商品 -->
                <div>
                  <div class="h-[200px] overflow-y-auto">
                    <div class="grid grid-cols-1 gap-2">
                      <div v-for="product in memberInfo.products" :key="product.id"
                           class="bg-gray-50 rounded-lg p-2.5 border border-gray-100 hover:shadow-sm transition-all duration-300">
                        <div class="flex items-center gap-2.5">
                          <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <el-image :src="product.image" class="w-full h-full object-cover rounded-lg">
                              <template #error>
                                <div class="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                                  <font-awesome-icon icon="image" class="text-gray-400 text-lg" />
                                </div>
                              </template>
                            </el-image>
                          </div>
                          <div class="flex-1 min-w-0">
                            <div class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</div>
                            <div class="flex items-center gap-3 mt-0.5">
                              <div class="text-xs text-gray-500 flex items-center gap-1">
                                <font-awesome-icon icon="cube" class="text-gray-400" />
                                <span>数量：{{ product.quantity }}</span>
                              </div>
                              <div class="text-xs text-gray-500 flex items-center gap-1">
                                <font-awesome-icon icon="coins" class="text-gray-400" />
                                <span>积分：{{ product.points }}</span>
                              </div>
                            </div>
                          </div>
                          <div v-if="isEditing" class="flex gap-1.5">
                            <button
                              class="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              @click="handleEditProduct(product)"
                            >
                              <font-awesome-icon icon="edit" />
                            </button>
                            <button
                              class="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              @click="handleDeleteProduct(product)"
                            >
                              <font-awesome-icon icon="trash" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 提货记录 -->
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="font-medium text-gray-800">提货记录</h4>
                  </div>
                  <div class="max-h-[240px] overflow-y-auto">
                    <table class="w-full">
                      <thead class="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品名称</th>
                          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提货数量</th>
                          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提货时间</th>
                          <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提货门店</th>
                          <th v-if="isEditing" class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <template v-if="memberInfo.pickupRecords?.length">
                          <tr v-for="record in memberInfo.pickupRecords" :key="record.productId" class="hover:bg-gray-50">
                            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                              {{ availableProducts.find(p => p.id === record.productId)?.name }}
                            </td>
                            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{{ record.quantity }}</td>
                            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{{ record.date }}</td>
                            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{{ record.store }}</td>
                            <td v-if="isEditing" class="px-3 py-2 whitespace-nowrap text-right text-sm">
                              <button
                                class="text-red-600 hover:text-red-700 transition-colors"
                                @click="handleDeletePickupRecord(record)"
                              >
                                <font-awesome-icon icon="trash" />
                              </button>
                            </td>
                          </tr>
                        </template>
                        <tr v-else>
                          <td colspan="4" class="px-3 py-4 text-sm text-gray-500 text-center">暂无提货记录</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 调整积分对话框 -->
    <el-dialog
      v-model="showAdjustPointsDialog"
      title="调整积分"
      width="480px"
      class="points-adjust-dialog"
    >
      <div class="space-y-7">
        <!-- 当前积分展示 -->
        <div class="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl p-7 text-white shadow-lg relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
          <div class="relative">
            <div class="text-sm font-medium opacity-90 mb-2 flex items-center gap-2">
              <font-awesome-icon icon="coins" class="text-yellow-300" />
              当前积分
            </div>
            <div class="text-4xl font-bold tracking-tight">{{ memberInfo.points }}</div>
          </div>
        </div>

        <!-- 调整类型选择 -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <font-awesome-icon icon="exchange-alt" class="text-blue-500" />
            调整类型
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              class="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border-2 transition-all duration-200"
              :class="[
                adjustForm.type === 'add'
                  ? 'border-green-500 bg-green-50 text-green-600 shadow-sm shadow-green-100'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
              ]"
              @click="adjustForm.type = 'add'"
            >
              <font-awesome-icon icon="plus-circle" :class="{'text-green-500': adjustForm.type === 'add'}" />
              <span>增加积分</span>
            </button>
            <button
              class="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border-2 transition-all duration-200"
              :class="[
                adjustForm.type === 'subtract'
                  ? 'border-red-500 bg-red-50 text-red-600 shadow-sm shadow-red-100'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
              ]"
              @click="adjustForm.type = 'subtract'"
            >
              <font-awesome-icon icon="minus-circle" :class="{'text-red-500': adjustForm.type === 'subtract'}" />
              <span>扣除积分</span>
            </button>
          </div>
        </div>

        <!-- 调整数量输入 -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <font-awesome-icon icon="calculator" class="text-blue-500" />
            调整数量
          </label>
          <div class="relative">
            <el-input-number
              v-model="adjustForm.points"
              :min="0"
              controls-position="right"
              class="!w-full !h-[48px]"
              placeholder="请输入调整积分"
              :class="{
                '!border-green-500 !shadow-green-100': adjustForm.type === 'add',
                '!border-red-500 !shadow-red-100': adjustForm.type === 'subtract'
              }"
            />
            <div class="absolute right-16 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
              积分
            </div>
          </div>
          <!-- 预览结果 -->
          <div class="mt-3">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span class="text-sm text-gray-600 flex items-center gap-2">
                <font-awesome-icon icon="chart-line" class="text-blue-500" />
                调整后积分
              </span>
              <span class="text-lg font-medium" :class="{
                'text-green-600': adjustForm.type === 'add' && adjustForm.points !== undefined,
                'text-red-600': adjustForm.type === 'subtract' && adjustForm.points !== undefined,
                'text-gray-600': adjustForm.points === undefined
              }">
                {{ adjustForm.points !== undefined && adjustForm.points !== null
                  ? adjustForm.type === 'add'
                    ? memberInfo.points + adjustForm.points
                    : memberInfo.points - adjustForm.points
                  : memberInfo.points }}
              </span>
            </div>
          </div>
        </div>

        <!-- 调整原因输入 -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <font-awesome-icon icon="comment-alt" class="text-blue-500" />
            调整原因
          </label>
          <el-input
            v-model="adjustForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入调整原因"
            class="!text-sm !rounded-xl"
            resize="none"
          />
        </div>
      </div>

      <!-- 底部按钮 -->
      <template #footer>
        <div class="flex justify-end gap-3 px-1">
          <el-button 
            @click="() => { 
              showAdjustPointsDialog = false; 
              adjustForm.points = undefined; 
              adjustForm.type = 'add'; 
              adjustForm.reason = '';
              $nextTick(() => {
                adjustForm.points = undefined;
              });
            }"
            class="!h-[44px] !rounded-xl !px-6"
            plain
          >取消</el-button>
          <el-button 
            type="primary" 
            @click="handleAdjustPoints"
            :class="{
              '!bg-green-500 !border-green-500 hover:!bg-green-600': adjustForm.type === 'add',
              '!bg-red-500 !border-red-500 hover:!bg-red-600': adjustForm.type === 'subtract'
            }"
            class="!h-[44px] !rounded-xl !px-6"
          >
            <div class="flex items-center gap-2">
              <font-awesome-icon :icon="adjustForm.type === 'add' ? 'check-circle' : 'minus-circle'" />
              <span>确认{{ adjustForm.type === 'add' ? '增加' : '扣除' }}</span>
            </div>
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加商品对话框 -->
    <el-dialog
      v-model="showAddProductDialog"
      title="添加商品"
      width="640px"
      class="points-adjust-dialog"
    >
      <div class="space-y-6">
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <font-awesome-icon icon="box" class="text-blue-500" />
            选择商品
          </label>
          <div class="bg-gray-50 rounded-xl p-4 max-h-[400px] overflow-y-auto">
            <div class="space-y-3">
              <div v-for="item in availableProducts" :key="item.id" 
                   class="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100">
                <div class="flex items-center gap-4 flex-1">
                  <el-checkbox 
                    v-model="productForm.selectedProducts"
                    :label="item.id"
                    @change="(checked: boolean) => handleProductSelect(checked, item)"
                  />
                  <el-image
                    :src="item.image"
                    class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  >
                    <template #error>
                      <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <font-awesome-icon icon="image" class="text-gray-400" />
                      </div>
                    </template>
                  </el-image>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium">{{ item.name }}</div>
                    <div class="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <font-awesome-icon icon="coins" class="text-yellow-400" />
                      <span>{{ item.points }} 积分</span>
                      <span class="mx-1">·</span>
                      <font-awesome-icon icon="box" class="text-gray-400" />
                      <span>库存: {{ item.stock }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex-shrink-0 w-[120px]" v-if="isProductSelected(item.id)">
                  <el-input-number
                    v-model="getSelectedProduct(item.id).quantity"
                    :min="1"
                    :max="item.stock"
                    controls-position="right"
                    class="!w-full"
                    @change="(val: number | undefined) => handleQuantityChange(item.id, val)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 已选商品统计 -->
        <div class="bg-blue-50 rounded-xl p-4" v-if="productForm.selectedProducts.length > 0">
          <div class="text-sm text-blue-600 font-medium mb-2">已选商品</div>
          <div class="text-sm text-gray-600">
            共选择 {{ productForm.selectedProducts.length }} 种商品，
            总积分：{{ calculateTotalPoints() }}
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3 px-1">
          <el-button 
            @click="() => { showAddProductDialog = false; productForm.selectedProducts = [] }"
            class="!h-[44px] !rounded-xl !px-6"
            plain
          >取消</el-button>
          <el-button 
            type="primary" 
            @click="handleAddProducts"
            class="!h-[44px] !rounded-xl !px-6 !bg-blue-500 !border-blue-500 hover:!bg-blue-600"
            :disabled="productForm.selectedProducts.length === 0"
          >
            <div class="flex items-center gap-2">
              <font-awesome-icon icon="plus-circle" />
              <span>确认添加</span>
            </div>
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加积分记录对话框 -->
    <el-dialog
      v-model="showAddPointsRecordDialog"
      title="添加积分记录"
      width="480px"
      class="points-adjust-dialog"
    >
      <div class="space-y-6">
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <font-awesome-icon icon="plus-circle" class="text-green-500" />
            获得积分
          </label>
          <el-input-number
            v-model="recordForm.points"
            :min="0"
            controls-position="right"
            class="!w-full !h-[48px]"
          />
        </div>
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <font-awesome-icon icon="minus-circle" class="text-red-500" />
            消费积分
          </label>
          <el-input-number
            v-model="recordForm.usedPoints"
            :min="0"
            controls-position="right"
            class="!w-full !h-[48px]"
          />
        </div>
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <font-awesome-icon icon="store" class="text-blue-500" />
            消费门店
          </label>
          <el-select
            v-model="recordForm.store"
            placeholder="请选择门店"
            class="!w-full"
          >
            <el-option
              v-for="store in stores"
              :key="store"
              :label="store"
              :value="store"
            >
              <div class="flex items-center gap-2">
                <font-awesome-icon icon="store" class="text-gray-400" />
                <span>{{ store }}</span>
              </div>
            </el-option>
          </el-select>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3 px-1">
          <el-button 
            @click="() => { showAddPointsRecordDialog = false; recordForm.points = 0; recordForm.usedPoints = 0; recordForm.store = '' }"
            class="!h-[44px] !rounded-xl !px-6"
            plain
          >取消</el-button>
          <el-button 
            type="primary" 
            @click="handleAddRecord"
            class="!h-[44px] !rounded-xl !px-6 !bg-blue-500 !border-blue-500 hover:!bg-blue-600"
          >
            <div class="flex items-center gap-2">
              <font-awesome-icon icon="plus-circle" />
              <span>确认添加</span>
            </div>
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadFile } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

// 编辑状态
const isEditing = ref(false)

// 对话框显示状态
const showAdjustPointsDialog = ref(false)
const showAddProductDialog = ref(false)
const showAddPointsRecordDialog = ref(false)

// 表单数据
const editForm = reactive({
  name: '',
  phone: '',
  cardNo: '',
  physicalNo: '',
  registerStore: ''
})

const adjustForm = reactive({
  type: 'add',
  points: undefined as number | undefined,
  reason: ''
})

const productForm = reactive({
  selectedProducts: [] as { id: number; quantity: number }[]
})

const recordForm = reactive({
  points: 0,
  usedPoints: 0,
  store: ''
})

// 门店列表
const stores = [
  '天河城分店',
  '北京路分店',
  '上下九分店',
  '珠江新城分店'
]

// 可选商品列表
const availableProducts = ref([
  {
    id: 1,
    name: '高级面部护理套装',
    points: 1000,
    image: 'https://placeholder.com/150',
    stock: 5
  },
  {
    id: 2,
    name: '美白精华液',
    points: 500,
    image: 'https://placeholder.com/150',
    stock: 8
  },
  {
    id: 3,
    name: '保湿面霜',
    points: 300,
    image: 'https://placeholder.com/150',
    stock: 10
  },
  {
    id: 4,
    name: '玫瑰精油',
    points: 800,
    image: 'https://placeholder.com/150',
    stock: 3
  },
  {
    id: 5,
    name: '洁面乳',
    points: 200,
    image: 'https://placeholder.com/150',
    stock: 15
  },
  {
    id: 6,
    name: '眼部精华',
    points: 600,
    image: 'https://placeholder.com/150',
    stock: 6
  },
  {
    id: 7,
    name: '防晒霜',
    points: 400,
    image: 'https://placeholder.com/150',
    stock: 12
  },
  {
    id: 8,
    name: '面膜套装',
    points: 700,
    image: 'https://placeholder.com/150',
    stock: 7
  },
  {
    id: 9,
    name: '身体乳',
    points: 450,
    image: 'https://placeholder.com/150',
    stock: 9
  },
  {
    id: 10,
    name: '护手霜',
    points: 150,
    image: 'https://placeholder.com/150',
    stock: 20
  }
])

interface Product {
  id: number
  name: string
  quantity: number
  points: number
  image: string
  stock: number
}

interface Order {
  id: string
  points: number
  usedPoints: number
  date: string
  store: string
}

interface MemberInfo {
  id: number
  name: string
  phone: string
  points: number
  totalPoints: number
  registerDate: string
  lastActive: string
  orderCount: number
  orders: Order[]
  cardNo: string
  physicalNo: string
  products: Product[]
  cardFrontImage?: string
  cardBackImage?: string
  pickupRecords?: { productId: number; quantity: number; date: string; store: string }[]
  registerStore: string
}

// 定义API响应类型
interface CardImagesResponse {
  frontImage: string
  backImage: string
}

// 模拟会员详情数据
const memberInfo = ref<MemberInfo>({
  id: Number(route.params.id),
  name: '张三',
  phone: '13800138000',
  points: 5000,
  totalPoints: 15800,
  registerDate: '2023-01-15',
  lastActive: '2024-03-20',
  orderCount: 12,
  cardNo: '8888 8888 8888 8888',
  physicalNo: '0123456789',
  products: [
    {
      id: 1,
      name: '高级面部护理套装',
      quantity: 2,
      points: 1000,
      image: 'https://placeholder.com/150',
      stock: 5
    },
    {
      id: 2,
      name: '美白精华液',
      quantity: 1,
      points: 500,
      image: 'https://placeholder.com/150',
      stock: 8
    }
  ],
  orders: [
    {
      id: 'DD20240320001',
      points: 258,
      usedPoints: 2580,
      date: '2024-03-20',
      store: '天河城分店'
    },
    {
      id: 'DD20240315002',
      points: 168,
      usedPoints: 1680,
      date: '2024-03-15',
      store: '天河城分店'
    },
    {
      id: 'DD20240310003',
      points: 98,
      usedPoints: 980,
      date: '2024-03-10',
      store: '天河城分店'
    },
    {
      id: 'DD20240305004',
      points: 320,
      usedPoints: 3200,
      date: '2024-03-05',
      store: '北京路分店'
    },
    {
      id: 'DD20240301005',
      points: 180,
      usedPoints: 1800,
      date: '2024-03-01',
      store: '珠江新城分店'
    },
    {
      id: 'DD20240225006',
      points: 420,
      usedPoints: 4200,
      date: '2024-02-25',
      store: '上下九分店'
    },
    {
      id: 'DD20240220007',
      points: 150,
      usedPoints: 1500,
      date: '2024-02-20',
      store: '天河城分店'
    },
    {
      id: 'DD20240215008',
      points: 280,
      usedPoints: 2800,
      date: '2024-02-15',
      store: '北京路分店'
    },
    {
      id: 'DD20240210009',
      points: 360,
      usedPoints: 3600,
      date: '2024-02-10',
      store: '珠江新城分店'
    },
    {
      id: 'DD20240205010',
      points: 195,
      usedPoints: 1950,
      date: '2024-02-05',
      store: '上下九分店'
    }
  ],
  cardFrontImage: '',
  cardBackImage: '',
  pickupRecords: [
    { productId: 1, quantity: 2, date: '2024-03-20', store: '天河城分店' },
    { productId: 2, quantity: 1, date: '2024-03-20', store: '天河城分店' },
    { productId: 3, quantity: 3, date: '2024-03-15', store: '北京路分店' },
    { productId: 4, quantity: 1, date: '2024-03-10', store: '珠江新城分店' },
    { productId: 5, quantity: 2, date: '2024-03-05', store: '上下九分店' },
    { productId: 6, quantity: 1, date: '2024-02-28', store: '天河城分店' },
    { productId: 7, quantity: 2, date: '2024-02-25', store: '北京路分店' },
    { productId: 8, quantity: 1, date: '2024-02-20', store: '珠江新城分店' },
    { productId: 9, quantity: 3, date: '2024-02-15', store: '上下九分店' },
    { productId: 10, quantity: 2, date: '2024-02-10', store: '天河城分店' }
  ],
  registerStore: '天河城分店'
})

// 获取IC卡照片
const fetchCardImages = async () => {
  try {
    // 这里应该调用后端API获取IC卡照片
    // 模拟API调用
    const response = await new Promise<CardImagesResponse>(resolve => setTimeout(() => {
      resolve({
        frontImage: 'https://example.com/card-front.jpg',
        backImage: 'https://example.com/card-back.jpg'
      })
    }, 1000))
    
    memberInfo.value.cardFrontImage = response.frontImage
    memberInfo.value.cardBackImage = response.backImage
  } catch (error) {
    console.error('获取IC卡照片失败:', error)
  }
}

// 在组件挂载时获取IC卡照片
onMounted(() => {
  fetchCardImages()
})

// 监听对话框显示状态，重置表单
watch(showAdjustPointsDialog, (newVal) => {
  if (newVal) {
    // 打开对话框时重置表单
    adjustForm.points = undefined
    adjustForm.type = 'add'
    adjustForm.reason = ''
  }
})

// 开始编辑
const handleEdit = () => {
  isEditing.value = true
  editForm.name = memberInfo.value.name
  editForm.phone = memberInfo.value.phone
  editForm.cardNo = memberInfo.value.cardNo
  editForm.physicalNo = memberInfo.value.physicalNo
  editForm.registerStore = memberInfo.value.registerStore
}

// 取消编辑
const handleCancel = () => {
  isEditing.value = false
}

// 保存编辑
const handleSave = async () => {
  try {
    // 这里应该调用API保存数据
    memberInfo.value = {
      ...memberInfo.value,
      name: editForm.name,
      phone: editForm.phone,
      cardNo: editForm.cardNo,
      physicalNo: editForm.physicalNo,
      registerStore: editForm.registerStore
    }
    isEditing.value = false
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 调整积分
const handleAdjustPoints = async () => {
  try {
    if (adjustForm.points === undefined) {
      ElMessage.warning('请输入调整积分')
      return
    }
    const points = adjustForm.type === 'add' ? adjustForm.points : -adjustForm.points
    memberInfo.value.points += points
    memberInfo.value.totalPoints += points > 0 ? points : 0

    // 添加积分记录
    memberInfo.value.orders.unshift({
      id: 'DD' + dayjs().format('YYYYMMDDHHmmss'),
      points: points > 0 ? points : 0,
      usedPoints: points < 0 ? -points : 0,
      date: dayjs().format('YYYY-MM-DD'),
      store: '系统调整'
    })

    showAdjustPointsDialog.value = false
    ElMessage.success('积分调整成功')
  } catch (error) {
    ElMessage.error('积分调整失败')
  }
}

// 处理商品选择
const handleProductSelect = (checked: boolean, product: { id: number; points: number; stock: number }) => {
  if (checked) {
    productForm.selectedProducts.push({
      id: product.id,
      quantity: 1
    })
  } else {
    const index = productForm.selectedProducts.findIndex(p => p.id === product.id)
    if (index !== -1) {
      productForm.selectedProducts.splice(index, 1)
    }
  }
}

// 检查商品是否被选中
const isProductSelected = (productId: number) => {
  return productForm.selectedProducts.some(p => p.id === productId)
}

// 获取已选商品的数据
const getSelectedProduct = (productId: number) => {
  return productForm.selectedProducts.find(p => p.id === productId) || { quantity: 1 }
}

// 处理数量变更
const handleQuantityChange = (productId: number, value: number | undefined) => {
  const product = productForm.selectedProducts.find(p => p.id === productId)
  if (product && value !== undefined) {
    product.quantity = value
  }
}

// 计算总积分
const calculateTotalPoints = () => {
  return productForm.selectedProducts.reduce((total, selected) => {
    const product = availableProducts.value.find(p => p.id === selected.id)
    return total + (product ? product.points * selected.quantity : 0)
  }, 0)
}

// 添加商品
const handleAddProducts = async () => {
  try {
    if (productForm.selectedProducts.length === 0) {
      ElMessage.warning('请选择商品')
      return
    }
    
    for (const selected of productForm.selectedProducts) {
      const product = availableProducts.value.find(p => p.id === selected.id)
      if (!product) continue

      // 检查商品是否已存在
      const existingProduct = memberInfo.value.products.find(p => p.id === product.id)
      if (existingProduct) {
        // 如果商品已存在，更新数量
        existingProduct.quantity += selected.quantity
      } else {
        // 如果商品不存在，添加新商品
        memberInfo.value.products.push({
          ...product,
          quantity: selected.quantity
        })
      }
    }

    showAddProductDialog.value = false
    productForm.selectedProducts = []
    ElMessage.success('商品添加成功')
  } catch (error) {
    ElMessage.error('商品添加失败')
  }
}

// 编辑商品
const handleEditProduct = (product: Product) => {
  // TODO: 实现商品编辑功能
}

// 删除商品
const handleDeleteProduct = async (product: Product) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
      type: 'warning'
    })
    memberInfo.value.products = memberInfo.value.products.filter(p => p.id !== product.id)
    ElMessage.success('商品删除成功')
  } catch (error) {
    // 用户取消删除
  }
}

// 添加积分记录
const handleAddRecord = async () => {
  try {
    memberInfo.value.orders.unshift({
      id: 'DD' + dayjs().format('YYYYMMDDHHmmss'),
      points: recordForm.points,
      usedPoints: recordForm.usedPoints,
      date: dayjs().format('YYYY-MM-DD'),
      store: recordForm.store
    })
    showAddPointsRecordDialog.value = false
    ElMessage.success('记录添加成功')
  } catch (error) {
    ElMessage.error('记录添加失败')
  }
}

// 删除积分记录
const handleDeleteRecord = async (order: Order) => {
  try {
    await ElMessageBox.confirm('确定要删除该记录吗？', '提示', {
      type: 'warning'
    })
    memberInfo.value.orders = memberInfo.value.orders.filter(o => o.id !== order.id)
    ElMessage.success('记录删除成功')
  } catch (error) {
    // 用户取消删除
  }
}

// 读取IC卡
const handleReadCard = async () => {
  try {
    ElMessage.info('正在读取IC卡...')
    // 模拟读卡延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟读卡结果
    const cardInfo = {
      cardNo: '8888 8888 8888 9999',
      physicalNo: '0123456999'
    }
    
    editForm.cardNo = cardInfo.cardNo
    editForm.physicalNo = cardInfo.physicalNo
    
    ElMessage.success('IC卡读取成功')
  } catch (error) {
    ElMessage.error('IC卡读取失败')
  }
}

// 删除提货记录
const handleDeletePickupRecord = async (record: { productId: number; quantity: number; date: string; store: string }) => {
  try {
    await ElMessageBox.confirm('确定要删除该记录吗？', '提示', {
      type: 'warning'
    })
    memberInfo.value.pickupRecords = memberInfo.value.pickupRecords?.filter(r => r.productId !== record.productId)
    ElMessage.success('记录删除成功')
  } catch (error) {
    // 用户取消删除
  }
}

// 处理图片上传
const handleImageChange = async (file: UploadFile, type: 'front' | 'back') => {
  if (!file || !file.raw) return
  
  // 验证文件类型
  const isImage = file.raw.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('请上传图片文件')
    return
  }
  
  // 验证文件大小（2MB）
  const isLt2M = file.raw.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return
  }
  
  try {
    // 转换为 base64 用于预览
    const reader = new FileReader()
    reader.onload = async (e) => {
      if (e.target?.result) {
        // 这里应该调用后端API上传图片
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (type === 'front') {
          memberInfo.value.cardFrontImage = e.target.result as string
          ElMessage.success('正面照片上传成功')
        } else {
          memberInfo.value.cardBackImage = e.target.result as string
          ElMessage.success('背面照片上传成功')
        }
      }
    }
    reader.readAsDataURL(file.raw)
  } catch (error) {
    console.error('上传图片失败:', error)
    ElMessage.error('上传图片失败，请重试')
  }
}
</script>

<style scoped>
:deep(.el-input) {
  .el-input__wrapper {
    box-shadow: none !important;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    background-color: transparent;
    padding: 0 1rem;
    
    &.is-focus {
      box-shadow: none !important;
      border-color: #3b82f6;
    }

    &:hover {
      border-color: #d1d5db;
    }
  }

  &.is-focus {
    .el-input__wrapper {
      box-shadow: none !important;
    }
  }

  .el-input__inner {
    height: 48px;
    box-shadow: none !important;
  }
}

:deep(.points-adjust-dialog) {
  .el-dialog__header {
    margin-right: 0;
    padding: 16px 16px 0;
    
    .el-dialog__title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }
  }
  
  .el-dialog__body {
    padding: 16px;
  }
  
  .el-dialog__footer {
    padding: 12px 16px 16px;
    border-top: 1px solid #e5e7eb;
  }

  .el-input {
    .el-input__wrapper {
      box-shadow: none !important;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      background-color: transparent;
      padding: 0 0.75rem;
      
      &.is-focus {
        box-shadow: none !important;
      }

      &:hover {
        border-color: #d1d5db;
      }
    }

    &.is-focus {
      .el-input__wrapper {
        box-shadow: none !important;
      }
    }

    .el-input__inner {
      height: 40px;
      box-shadow: none !important;
    }
  }
  
  .el-input-number {
    .el-input-number__decrease,
    .el-input-number__increase {
      border-color: #e5e7eb;
      background-color: #f9fafb;
      width: 28px;
      height: 40px;
      line-height: 40px;
      
      &:hover {
        background-color: #f3f4f6;
      }
    }
    
    .el-input__inner {
      height: 40px;
      font-size: 0.875rem;
      padding-left: 8px;
      padding-right: 64px;
      border-radius: 0.5rem;
      text-align: center;
      
      &:focus {
        box-shadow: none;
        border-color: #3b82f6;
      }

      &::placeholder {
        color: #9ca3af;
      }
    }
  }
  
  .el-select {
    .el-input {
      .el-input__wrapper {
        box-shadow: none !important;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        background-color: transparent;
        padding: 0 0.75rem;
      }
    }

    .el-input__inner {
      height: 40px;
    }
  }
  
  .el-select-dropdown {
    border: none;
    margin: 4px 0;
    padding: 4px;
    border-radius: 0.5rem;
  }
  
  .el-select-dropdown__item {
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    margin: 2px 0;
  }
}
</style> 