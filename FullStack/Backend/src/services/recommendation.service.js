const generateRecommendation = (inputData) => {
  const {
    limit_bal,

    pay_1,
    pay_2,
    pay_3,
    pay_4,
    pay_5,
    pay_6,

    bill_amt1,
    bill_amt2,
    bill_amt3,

    pay_amt1,
  } = inputData;

  // hitung total tagihan
  const total_bill =
    bill_amt1 +
    bill_amt2 +
    bill_amt3;

  // hitung total pembayaran
  const total_payment = pay_amt1;

  // rasio utang
  const debt_ratio =
    total_bill / limit_bal;

  // rata-rata keterlambatan pembayaran 6 bulan
  const avg_delay =
    (
      pay_1 +
      pay_2 +
      pay_3 +
      pay_4 +
      pay_5 +
      pay_6
    ) / 6;

  // rasio pembayaran
  const payment_ratio =
    total_bill === 0
      ? 0
      : total_payment / total_bill;

  let riskScore = 30;
  let riskLevel = 'Low Risk';

  const causes = [];
  const recommendations = [];

  // analisis debt ratio
  if (debt_ratio >= 0.8) {
    riskScore += 35;

    causes.push(
      'Penggunaan limit kredit sangat tinggi'
    );

    recommendations.push(
      'Kurangi penggunaan kredit agar rasio utang lebih sehat'
    );
  } else if (debt_ratio >= 0.5) {
    riskScore += 20;

    causes.push(
      'Penggunaan limit kredit berada pada tingkat sedang'
    );

    recommendations.push(
      'Kontrol penggunaan kartu kredit secara lebih bijak'
    );
  } else {
    causes.push(
      'Penggunaan limit kredit masih dalam batas aman'
    );
  }

  // analisis keterlambatan pembayaran
  if (avg_delay >= 1) {
    riskScore += 35;

    causes.push(
      'Riwayat pembayaran menunjukkan keterlambatan'
    );

    recommendations.push(
      'Lakukan pembayaran sebelum jatuh tempo'
    );
  } else {
    causes.push(
      'Riwayat pembayaran relatif baik'
    );

    recommendations.push(
      'Pertahankan kebiasaan pembayaran yang baik'
    );
  }

  // analisis payment ratio
  if (payment_ratio < 0.5) {
    riskScore += 20;

    causes.push(
      'Jumlah pembayaran masih jauh di bawah total tagihan'
    );

    recommendations.push(
      'Tingkatkan nominal pembayaran tagihan'
    );
  } else {
    causes.push(
      'Pembayaran tagihan cukup baik dibanding total tagihan'
    );
  }

  // klasifikasi risiko
  if (riskScore >= 80) {
    riskLevel = 'High Risk';
  } else if (riskScore >= 50) {
    riskLevel = 'Medium Risk';
  } else {
    riskLevel = 'Low Risk';
  }

  return {
    risk_score: riskScore,
    risk_level: riskLevel,

    analysis: {
      total_bill,
      total_payment,
      debt_ratio,
      avg_delay,
      payment_ratio,
    },

    causes,
    recommendations,
  };
};

module.exports = {
  generateRecommendation,
};

