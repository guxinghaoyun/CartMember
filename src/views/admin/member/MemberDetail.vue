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
            <!-- 隐藏编辑按钮
            <button
              class="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
              @click="handleEdit"
              v-if="!isEditing"
            >
              <font-awesome-icon icon="edit" />
              <span>编辑信息</span>
            </button>
            -->
            <template v-if="isEditing">
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
              <div
                class="flex items-start gap-3 p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl"
              >
                <div
                  class="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-100"
                >
                  <font-awesome-icon icon="user" class="text-3xl text-white" />
                </div>
                <div class="flex-1 pt-0.5">
                  <template v-if="!isEditing">
                    <div class="flex items-center justify-between">
                      <div>
                        <div class="text-xl font-semibold text-gray-900">{{ memberInfo.name }}</div>
                        <div class="flex items-center gap-2 mt-1.5">
                          <span
                            class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                          >
                            ID: {{ memberInfo.id }}
                          </span>
                          <span
                            class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium"
                          >
                            积分: {{ memberInfo.points }}
                          </span>
                        </div>
                      </div>
                      <!-- 右侧积分和消费总额展示 -->
                      <div class="flex items-center gap-4">
                        <div
                          class="px-4 py-2 bg-green-50 border border-green-100 rounded-lg text-center w-36 shadow-sm"
                        >
                          <div class="text-xs text-green-600 mb-1">可用积分</div>
                          <div class="text-xl font-bold text-green-700">
                            {{ memberInfo.points }}
                          </div>
                        </div>
                        <div
                          class="px-4 py-2 bg-red-50 border border-red-100 rounded-lg text-center w-36 shadow-sm"
                        >
                          <div class="text-xs text-red-600 mb-1">可提商品</div>
                          <div class="text-xl font-bold text-red-700">
                            {{ totalProducts || 0 }} 件
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
                        <div class="font-medium text-gray-900">{{ memberInfo.internalNumber }}</div>
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
                        <div class="font-medium text-gray-900">{{ memberInfo.surfaceNumber }}</div>
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
                      <div class="font-medium text-gray-900">
                        {{ formatDate(memberInfo.registerDate) }}
                      </div>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-2.5">
                      <div class="text-xs text-gray-500 mb-1">所属店铺</div>
                      <template v-if="!isEditing">
                        <div class="font-medium text-gray-900">{{ memberInfo.registerStore }}</div>
                      </template>
                      <template v-else>
                        <el-select
                          v-model="editForm.registerStore"
                          placeholder="选择店铺"
                          class="!w-full"
                        >
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
                      <div class="font-medium text-gray-900">
                        {{ formatDate(memberInfo.lastActive) }}
                      </div>
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
                        <div
                          class="aspect-[1.586/1] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200"
                        >
                          <MemberCardImage
                            :member-id="memberInfo.id"
                            :image-uuid="memberInfo.frontPicture"
                            alt="IC卡正面"
                            mode="cover"
                            class="w-full h-full"
                          />
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
                            <el-button
                              type="primary"
                              class="!bg-blue-500 hover:!bg-blue-600 !rounded-lg !text-sm"
                            >
                              <font-awesome-icon icon="upload" class="mr-1" />
                              上传正面照片
                            </el-button>
                          </el-upload>
                        </div>
                      </div>
                      <div class="space-y-1">
                        <div
                          class="aspect-[1.586/1] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200"
                        >
                          <MemberCardImage
                            :member-id="memberInfo.id"
                            :image-uuid="memberInfo.backPicture"
                            alt="IC卡背面"
                            mode="cover"
                            class="w-full h-full"
                          />
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
                            <el-button
                              type="primary"
                              class="!bg-blue-500 hover:!bg-blue-600 !rounded-lg !text-sm"
                            >
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
                  <div
                    class="bg-blue-50 rounded-xl p-4 border border-blue-100 hover:shadow-sm transition-all duration-200"
                  >
                    <div class="flex items-center justify-between">
                      <div class="text-sm text-blue-600 font-medium">累计积分</div>
                      <div
                        class="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center"
                      >
                        <font-awesome-icon icon="chart-line" class="text-blue-500" />
                      </div>
                    </div>
                    <div class="text-2xl font-bold mt-2 text-gray-800">
                      {{ memberInfo.totalPoints }}
                    </div>
                  </div>
                  <div
                    class="bg-green-50 rounded-xl p-4 border border-green-100 hover:shadow-sm transition-all duration-200"
                  >
                    <div class="flex items-center justify-between">
                      <div class="text-sm text-green-600 font-medium">当前积分</div>
                      <div
                        class="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center"
                      >
                        <font-awesome-icon icon="coins" class="text-green-500" />
                      </div>
                    </div>
                    <div class="text-2xl font-bold mt-2 text-gray-800">{{ memberInfo.points }}</div>
                  </div>
                  <div
                    class="bg-purple-50 rounded-xl p-4 border border-purple-100 hover:shadow-sm transition-all duration-200"
                  >
                    <div class="flex items-center justify-between">
                      <div class="text-sm text-purple-600 font-medium">消费次数</div>
                      <div
                        class="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center"
                      >
                        <font-awesome-icon icon="receipt" class="text-purple-500" />
                      </div>
                    </div>
                    <div class="text-2xl font-bold mt-2 text-gray-800">{{ orderCount || 0 }}</div>
                  </div>
                  <div
                    class="bg-orange-50 rounded-xl p-4 border border-orange-100 hover:shadow-sm transition-all duration-200"
                  >
                    <div class="flex items-center justify-between">
                      <div class="text-sm text-orange-600 font-medium">平均消费积分</div>
                      <div
                        class="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center"
                      >
                        <font-awesome-icon icon="calculator" class="text-orange-500" />
                      </div>
                    </div>
                    <div class="text-2xl font-bold mt-2 text-gray-800">
                      {{ orderCount ? Math.round(memberInfo.totalPoints / orderCount) : 0 }}
                    </div>
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
                          <th
                            class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            订单编号
                          </th>
                          <th
                            class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            获得积分
                          </th>
                          <th
                            class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            消费积分
                          </th>
                          <th
                            class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            消费时间
                          </th>
                          <th
                            class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            消费门店
                          </th>
                          <th
                            v-if="isEditing"
                            class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr
                          v-for="order in memberInfo.orders"
                          :key="order.id"
                          class="hover:bg-gray-50"
                        >
                          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {{ order.id }}
                          </td>
                          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {{ order.points }}
                          </td>
                          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {{ order.usedPoints }}
                          </td>
                          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {{ formatDate(order.date) }}
                          </td>
                          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {{ order.store }}
                          </td>
                          <td
                            v-if="isEditing"
                            class="px-4 py-3 whitespace-nowrap text-right text-sm"
                          >
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
                      <div
                        v-for="product in memberInfo.products"
                        :key="product.id"
                        class="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:shadow-sm transition-all duration-300"
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0"
                          >
                            <ProductImage
                              :product-id="product.id"
                              :image-uuid="product.image"
                              :image-class="'w-full h-full object-cover rounded-lg'"
                            />
                          </div>
                          <div class="flex items-center gap-3 flex-1 min-w-0">
                            <div class="text-sm font-medium text-gray-900 truncate mr-1">
                              {{ product.name }}
                            </div>
                            <div class="flex items-center gap-2 flex-nowrap">
                              <div
                                class="flex items-center px-2 py-1 bg-blue-50 rounded-md whitespace-nowrap"
                              >
                                <font-awesome-icon
                                  icon="cube"
                                  class="text-blue-500 text-xs mr-1.5"
                                />
                                <span class="text-xs font-medium text-gray-700">
                                  {{ product.quantity }} 件
                                </span>
                              </div>
                              <div
                                class="flex items-center px-2 py-1 bg-amber-50 rounded-md whitespace-nowrap"
                              >
                                <font-awesome-icon
                                  icon="coins"
                                  class="text-amber-500 text-xs mr-1.5"
                                />
                                <span class="text-xs font-medium text-gray-700">
                                  {{ product.points }} 积分
                                </span>
                              </div>
                            </div>
                          </div>
                          <div v-if="isEditing" class="flex gap-1.5 ml-2">
                            <button
                              class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              @click="handleEditProduct(product)"
                            >
                              <font-awesome-icon icon="edit" />
                            </button>
                            <button
                              class="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              @click="handleDeleteProduct(product.id)"
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
                          <th
                            class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            商品名称
                          </th>
                          <th
                            class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            提货数量
                          </th>
                          <th
                            class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            提货时间
                          </th>
                          <th
                            class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            提货门店
                          </th>
                          <th
                            v-if="isEditing"
                            class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <template v-if="memberInfo.pickupRecords?.length">
                          <tr
                            v-for="record in memberInfo.pickupRecords"
                            :key="record.productId"
                            class="hover:bg-gray-50"
                          >
                            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                              {{ availableProducts.find(p => p.id === record.productId)?.name }}
                            </td>
                            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                              {{ record.quantity }}
                            </td>
                            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {{ formatDate(record.date) }}
                            </td>
                            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {{ record.store }}
                            </td>
                            <td
                              v-if="isEditing"
                              class="px-3 py-2 whitespace-nowrap text-right text-sm"
                            >
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
                          <td colspan="4" class="px-3 py-4 text-sm text-gray-500 text-center">
                            暂无提货记录
                          </td>
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
        <div
          class="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl p-7 text-white shadow-lg relative overflow-hidden"
        >
          <div
            class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"
          ></div>
          <div
            class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"
          ></div>
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
              <font-awesome-icon
                icon="plus-circle"
                :class="{ 'text-green-500': adjustForm.type === 'add' }"
              />
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
              <font-awesome-icon
                icon="minus-circle"
                :class="{ 'text-red-500': adjustForm.type === 'subtract' }"
              />
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
            <div
              class="absolute right-16 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none"
            >
              积分
            </div>
          </div>
          <!-- 预览结果 -->
          <div class="mt-3">
            <div
              class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
            >
              <span class="text-sm text-gray-600 flex items-center gap-2">
                <font-awesome-icon icon="chart-line" class="text-blue-500" />
                调整后积分
              </span>
              <span
                class="text-lg font-medium"
                :class="{
                  'text-green-600': adjustForm.type === 'add' && adjustForm.points !== undefined,
                  'text-red-600': adjustForm.type === 'subtract' && adjustForm.points !== undefined,
                  'text-gray-600': adjustForm.points === undefined
                }"
              >
                {{
                  adjustForm.points !== undefined && adjustForm.points !== null
                    ? adjustForm.type === 'add'
                      ? memberInfo.points + adjustForm.points
                      : memberInfo.points - adjustForm.points
                    : memberInfo.points
                }}
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
            @click="
              () => {
                showAdjustPointsDialog = false
                adjustForm.points = 0
                adjustForm.type = 'add'
                adjustForm.reason = ''
                $nextTick(() => {
                  adjustForm.points = 0
                })
              }
            "
            class="!h-[44px] !rounded-xl !px-6"
            plain
          >
            取消
          </el-button>
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
              <font-awesome-icon
                :icon="adjustForm.type === 'add' ? 'check-circle' : 'minus-circle'"
              />
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
              <div
                v-for="item in availableProducts"
                :key="item.id"
                class="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100"
              >
                <div class="flex items-center gap-4 flex-1">
                  <el-checkbox
                    v-model="productForm.products"
                    :label="item.id"
                    @change="(checked: boolean) => handleProductSelect(checked, item)"
                  />
                  <ProductImage
                    :product-id="item.id"
                    :image-uuid="item.image"
                    :image-class="'w-12 h-12 rounded-lg object-cover flex-shrink-0'"
                  />
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
        <div class="bg-blue-50 rounded-xl p-4" v-if="productForm.products.length > 0">
          <div class="text-sm text-blue-600 font-medium mb-2">已选商品</div>
          <div class="text-sm text-gray-600">
            共选择 {{ productForm.products.length }} 种商品， 总积分：{{ calculateTotalPoints() }}
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3 px-1">
          <el-button
            @click="
              () => {
                showAddProductDialog = false
                productForm.products = []
              }
            "
            class="!h-[44px] !rounded-xl !px-6"
            plain
          >
            取消
          </el-button>
          <el-button
            type="primary"
            @click="handleAddProducts"
            class="!h-[44px] !rounded-xl !px-6 !bg-blue-500 !border-blue-500 hover:!bg-blue-600"
            :disabled="productForm.products.length === 0"
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
          <el-select v-model="recordForm.store" placeholder="请选择门店" class="!w-full">
            <el-option v-for="store in stores" :key="store" :label="store" :value="store">
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
            @click="
              () => {
                showAddPointsRecordDialog = false
                recordForm.points = 0
                recordForm.usedPoints = 0
                recordForm.store = ''
              }
            "
            class="!h-[44px] !rounded-xl !px-6"
            plain
          >
            取消
          </el-button>
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
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadFile } from 'element-plus'
import dayjs from 'dayjs'
import { memberApi } from '@/api/admin/member'
import MemberCardImage from '@/components/common/MemberCardImage.vue'
import ProductImage from '@/components/common/ProductImage.vue'
import type { Member, AdjustPointsRequest, AddProductsRequest } from '@/types/api/admin/member'

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

const adjustForm = reactive<AdjustPointsRequest>({
  type: 'add',
  points: 0,
  reason: ''
})

const productForm = reactive<AddProductsRequest>({
  products: []
})

const recordForm = reactive({
  points: 0,
  usedPoints: 0,
  store: ''
})

// 门店列表
const stores = ['天河城分店', '北京路分店', '上下九分店', '珠江新城分店']

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

// 会员信息
const memberInfo = ref<Member>({
  id: Number(route.params.id),
  name: '',
  phone: '',
  points: 0,
  totalPoints: 0,
  surfaceNumber: '',
  internalNumber: '',
  registerDate: '',
  icStatus: true,
  lastActive: '',
  registerStore: '',
  orderCount: 0,
  products: [],
  orders: [],
  pickupRecords: []
})

// 计算属性
const totalProducts = computed(
  () => memberInfo.value.products?.reduce((total, product) => total + product.quantity, 0) ?? 0
)

const totalProductPoints = computed(
  () =>
    memberInfo.value.products?.reduce(
      (total, product) => total + product.points * product.quantity,
      0
    ) ?? 0
)

const orderCount = computed(() => memberInfo.value.orders?.length ?? 0)

// 计算消费总额（假设1积分=1元）
const totalConsumption = computed(() => {
  const usedPoints =
    memberInfo.value.orders?.reduce((total, order) => total + (order.usedPoints || 0), 0) ?? 0
  return usedPoints
})

// 格式化日期显示
const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return ''
  // 处理包含T的ISO格式日期
  if (dateString.includes('T')) {
    const date = new Date(dateString)
    return date
      .toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      .replace(/\//g, '-')
  }
  return dateString
}

// 只显示日期部分
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return ''
  // 处理包含T的ISO格式日期
  if (dateString.includes('T')) {
    const date = new Date(dateString)
    return date
      .toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
      .replace(/\//g, '-')
  }
  return dateString
}

// 获取会员详情
const fetchMemberDetail = async () => {
  // 如果没有存储的数据，则从API获取
  const response = await memberApi.getDetail(memberInfo.value.id)
  memberInfo.value = response.data.data
}

// 开始编辑
const handleEdit = () => {
  isEditing.value = true
  editForm.name = memberInfo.value.name
  editForm.phone = memberInfo.value.phone
  editForm.cardNo = memberInfo.value.surfaceNumber
  editForm.physicalNo = memberInfo.value.internalNumber
  editForm.registerStore = memberInfo.value.registerStore || ''
}

// 取消编辑
const handleCancel = () => {
  isEditing.value = false
}

// 保存编辑
const handleSave = async () => {
  try {
    const response = await memberApi.update(memberInfo.value.id, {
      name: editForm.name,
      phone: editForm.phone,
      surfaceNumber: editForm.cardNo,
      internalNumber: editForm.physicalNo,
      registerStore: editForm.registerStore
    })
    memberInfo.value = response.data.data
    isEditing.value = false
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 调整积分
const handleAdjustPoints = async () => {
  try {
    const response = await memberApi.adjustPoints(memberInfo.value.id, adjustForm)
    memberInfo.value = response.data.data
    showAdjustPointsDialog.value = false
    ElMessage.success('积分调整成功')
  } catch (error) {
    ElMessage.error('积分调整失败')
  }
}

// 处理商品选择
const handleProductSelect = (
  checked: boolean,
  product: { id: number; points: number; stock: number }
) => {
  if (checked) {
    productForm.products.push({
      id: product.id,
      quantity: 1
    })
  } else {
    const index = productForm.products.findIndex(p => p.id === product.id)
    if (index !== -1) {
      productForm.products.splice(index, 1)
    }
  }
}

// 检查商品是否被选中
const isProductSelected = (productId: number) => {
  return productForm.products.some(p => p.id === productId)
}

// 获取已选商品的数据
const getSelectedProduct = (productId: number) => {
  return productForm.products.find(p => p.id === productId) || { quantity: 1 }
}

// 处理数量变更
const handleQuantityChange = (productId: number, value: number | undefined) => {
  const product = productForm.products.find(p => p.id === productId)
  if (product && value !== undefined) {
    product.quantity = value
  }
}

// 计算总积分
const calculateTotalPoints = () => {
  return productForm.products.reduce((total, selected) => {
    const product = availableProducts.value.find(p => p.id === selected.id)
    return total + (product ? product.points * selected.quantity : 0)
  }, 0)
}

// 添加商品
const handleAddProducts = async () => {
  try {
    const response = await memberApi.addProducts(memberInfo.value.id, productForm)
    memberInfo.value = response.data.data
    showAddProductDialog.value = false
    productForm.products = []
    ElMessage.success('商品添加成功')
  } catch (error) {
    ElMessage.error('商品添加失败')
  }
}

// 编辑商品
const handleEditProduct = (product: { id: number; quantity: number; points: number }) => {
  // TODO: 实现商品编辑功能
}

// 删除商品
const handleDeleteProduct = async (productId: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
      type: 'warning'
    })
    await memberApi.removeProduct(memberInfo.value.id, productId)
    memberInfo.value.products = memberInfo.value.products?.filter(p => p.id !== productId)
    ElMessage.success('商品删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('商品删除失败')
    }
  }
}

// 添加积分记录
const handleAddRecord = async () => {
  try {
    if (!memberInfo.value.orders) {
      memberInfo.value.orders = []
    }
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
const handleDeleteRecord = async (order: {
  id: string
  points: number
  usedPoints: number
  date: string
  store: string
}) => {
  try {
    await ElMessageBox.confirm('确定要删除该记录吗？', '提示', {
      type: 'warning'
    })
    if (memberInfo.value.orders) {
      memberInfo.value.orders = memberInfo.value.orders.filter(o => o.id !== order.id)
      ElMessage.success('记录删除成功')
    }
  } catch (error) {
    // 用户取消删除
  }
}

// 读取IC卡
const handleReadCard = async () => {
  try {
    ElMessage.info('正在读取IC卡...')
    const response = await memberApi.readCardInfo()
    const cardInfo = response.data.data
    editForm.cardNo = cardInfo.cardNo
    editForm.physicalNo = cardInfo.physicalNo
    ElMessage.success('IC卡读取成功')
  } catch (error) {
    ElMessage.error('IC卡读取失败')
  }
}

// 删除提货记录
const handleDeletePickupRecord = async (record: {
  productId: number
  quantity: number
  date: string
  store: string
}) => {
  try {
    await ElMessageBox.confirm('确定要删除该记录吗？', '提示', {
      type: 'warning'
    })
    memberInfo.value.pickupRecords = memberInfo.value.pickupRecords?.filter(
      r => r.productId !== record.productId
    )
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
    const response = await memberApi.updateCardImage(memberInfo.value.id, type, file.raw)
    // 更新对应的图片UUID
    if (type === 'front') {
      memberInfo.value.frontPicture = response.data.data.url
      ElMessage.success('正面照片上传成功')
    } else {
      memberInfo.value.backPicture = response.data.data.url
      ElMessage.success('背面照片上传成功')
    }
  } catch (error) {
    console.error('上传图片失败:', error)
    ElMessage.error('上传图片失败，请重试')
  }
}

// 在组件挂载时获取会员详情
onMounted(() => {
  fetchMemberDetail()
})

// 监听对话框显示状态，重置表单
watch(showAdjustPointsDialog, newVal => {
  if (newVal) {
    adjustForm.points = 0
    adjustForm.type = 'add'
    adjustForm.reason = ''
  }
})
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
