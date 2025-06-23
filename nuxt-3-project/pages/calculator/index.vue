<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

import jsPDF from 'jspdf'
import 'jspdf-autotable'

// --- Inputs ---
const loanAmount = ref(100000)       // 100,000 - 10,000,000
const interestRate = ref(5)          // 1 - 20 %
const loanTermYears = ref(1)         // ปี
const loanTermMonths = ref(0)        // เดือน
const startDate = ref(new Date().toISOString().substring(0, 10)) 

// --- Validations & Limits ---
const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max)

// --- Computed values ---
const totalMonths = computed(() => clamp(loanTermYears.value * 12 + loanTermMonths.value, 1, 600))

const monthlyInterestRate = computed(() => interestRate.value / 100 / 12)

const monthlyPayment = computed(() => {
  const P = clamp(loanAmount.value, 100000, 10000000)
  const r = monthlyInterestRate.value
  const n = totalMonths.value

  if (r === 0) return P / n

  return (P * r) / (1 - Math.pow(1 + r, -n))
})

const totalPayment = computed(() => monthlyPayment.value * totalMonths.value)
const totalInterest = computed(() => totalPayment.value - loanAmount.value)

// --- Amortization Schedule ---
interface ScheduleItem {
  month: number
  date: string
  payment: number
  principal: number
  interest: number
  balance: number
}

const schedule = computed<ScheduleItem[]>(() => {
  const P = clamp(loanAmount.value, 100000, 10000000)
  const r = monthlyInterestRate.value
  const n = totalMonths.value
  let balance = P

  // แปลง string -> Date แบบปลอดภัย
  const [year, month, day] = startDate.value.split('-').map(Number)
  const start = new Date(year, month - 1, day)

  const result: ScheduleItem[] = []

  for (let i = 1; i <= n; i++) {
    let interestPayment = r * balance
    let principalPayment = monthlyPayment.value - interestPayment
    if (balance - principalPayment < 0) principalPayment = balance
    balance -= principalPayment

    const paymentDate = new Date(start)
    paymentDate.setMonth(paymentDate.getMonth() + i - 1)
    const dateStr = paymentDate.toISOString().substring(0, 10)

    result.push({
      month: i,
      date: dateStr, // ✅ เก็บเป็น string เท่านั้น
      payment: monthlyPayment.value,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(balance, 0),
    })
  }

  return result
})


// --- Export Functions ---

async function exportToExcel() {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Amortization')

  // Header row
  worksheet.addRow(['เดือน', 'วันที่', 'ยอดผ่อนชำระ', 'ตัดต้น', 'ดอกเบี้ย', 'ยอดคงเหลือ'])

  // Data rows
  schedule.value.forEach(item => {
    worksheet.addRow([
      item.month,
      item.date,
      item.payment.toFixed(2),
      item.principal.toFixed(2),
      item.interest.toFixed(2),
      item.balance.toFixed(2),
    ])
  })

  // Save file
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  saveAs(blob, 'loan_schedule.xlsx')
}

function exportToPDF() {
  // const doc = new jsPDF()
  // doc.text('ตารางการผ่อนชำระ (Amortization Schedule)', 14, 15)
  // doc.addFileToVFS('THSarabun.ttf', base64FontData)
  // doc.addFont('THSarabun.ttf', 'THSarabun', 'normal')
  // doc.setFont('THSarabun')
  // const rows = schedule.value.map(item => [
  //   item.month,
  //   item.date,
  //   item.payment.toFixed(2),
  //   item.principal.toFixed(2),
  //   item.interest.toFixed(2),
  //   item.balance.toFixed(2),
  // ])
  
  // doc.autoTable({
  //   head: [['เดือน', 'วันที่', 'ยอดผ่อนชำระ', 'ตัดต้น', 'ดอกเบี้ย', 'ยอดคงเหลือ']],
  //   body: rows,
  //   startY: 20,
  //   styles: { fontSize: 8 },
  //   headStyles: { fillColor: [22, 160, 133] },
  // })

 const doc = new jsPDF()
  doc.addFileToVFS('THSarabun.ttf', base64FontData)
  doc.addFont('THSarabun.ttf', 'THSarabun', 'normal')
  doc.setFont('THSarabun')
  doc.text('ตารางการผ่อนชำระ (Amortization Schedule)', 14, 15)
  doc.save('test.pdf')
  // doc.save('loan_schedule.pdf')
}
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-md shadow-md mt-10 text-gray-900 dark:text-gray-100">
    <h1 class="text-3xl font-bold mb-6 text-center">เครื่องคำนวณสินเชื่อ</h1>

    <!-- Inputs -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <label class="block mb-1 font-semibold">ยอดเงินกู้ (100,000 - 10,000,000 บาท)</label>
        <input
          type="number"
          v-model.number="loanAmount"
          min="100000"
          max="10000000"
          step="1000"
          class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div>
        <label class="block mb-1 font-semibold">อัตราดอกเบี้ยต่อปี (1 - 20%)</label>
        <input
          type="number"
          v-model.number="interestRate"
          min="1"
          max="20"
          step="0.01"
          class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div class="flex space-x-4">
        <div class="flex-1">
          <label class="block mb-1 font-semibold">ระยะเวลากู้ (ปี)</label>
          <input
            type="number"
            v-model.number="loanTermYears"
            min="0"
            max="50"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div class="flex-1">
          <label class="block mb-1 font-semibold">ระยะเวลากู้ (เดือน)</label>
          <input
            type="number"
            v-model.number="loanTermMonths"
            min="0"
            max="11"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div>
        <label class="block mb-1 font-semibold">วันที่เริ่มต้นสัญญา</label>
        <input
          type="date"
          v-model="startDate"
          class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>

    <!-- Results -->
    <div class="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded space-y-3">
      <p>
        <strong>ยอดผ่อนชำระต่อเดือน:</strong>
        {{ monthlyPayment.toFixed(2) }} บาท
      </p>
      <p>
        <strong>ดอกเบี้ยรวม:</strong>
        {{ totalInterest.toFixed(2) }} บาท
      </p>
      <p>
        <strong>ยอดชำระทั้งหมด:</strong>
        {{ totalPayment.toFixed(2) }} บาท
      </p>
    </div>

    <!-- Amortization Schedule Table -->
    <div class="overflow-auto max-h-96 mb-6">
      <table class="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
        <thead class="bg-gray-200 dark:bg-gray-700 sticky top-0">
          <tr>
            <th class="border border-gray-300 dark:border-gray-600 px-2 py-1">เดือน</th>
            <th class="border border-gray-300 dark:border-gray-600 px-2 py-1">วันที่</th>
            <th class="border border-gray-300 dark:border-gray-600 px-2 py-1">ยอดผ่อนชำระ</th>
            <th class="border border-gray-300 dark:border-gray-600 px-2 py-1">ตัดต้น</th>
            <th class="border border-gray-300 dark:border-gray-600 px-2 py-1">ดอกเบี้ย</th>
            <th class="border border-gray-300 dark:border-gray-600 px-2 py-1">ยอดคงเหลือ</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in schedule"
            :key="item.month"
            class="even:bg-gray-50 dark:even:bg-gray-800"
          >
            <td class="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">{{ item.month }}</td>
            <td class="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">{{ item.date }}</td>
            <td class="border border-gray-300 dark:border-gray-600 px-2 py-1 text-right">{{ item.payment.toFixed(2) }}</td>
            <td class="border border-gray-300 dark:border-gray-600 px-2 py-1 text-right">{{ item.principal.toFixed(2) }}</td>
            <td class="border border-gray-300 dark:border-gray-600 px-2 py-1 text-right">{{ item.interest.toFixed(2) }}</td>
            <td class="border border-gray-300 dark:border-gray-600 px-2 py-1 text-right">{{ item.balance.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Export Buttons -->
    <div class="flex space-x-4 justify-center">
      <button
        @click="exportToPDF"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Export PDF
      </button>
      <button
        @click="exportToExcel"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Export Excel
      </button>
      
    </div>
  </div>
</template>
