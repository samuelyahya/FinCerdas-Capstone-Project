import streamlit as st
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

st.set_page_config(
    page_title="Credit Default Dashboard",
    layout="wide"
)

# Fungsi Helper
def vis_boxplot(pay, data):

    # Mapping periode pembayaran
    period_map = {
        'PAY_AMT1': 'Current Month Payment',
        'PAY_AMT2': '1 Month Before Payment',
        'PAY_AMT3': '2 Months Before Payment',
        'PAY_AMT4': '3 Months Before Payment',
        'PAY_AMT5': '4 Months Before Payment',
        'PAY_AMT6': '5 Months Before Payment'
    }

    fig, ax = plt.subplots(figsize=(8,6))

    sns.boxplot(
        x='default',
        y=pay,
        data=data,
        palette='coolwarm',
        hue='default',
        legend=False,
        showfliers=False,
        ax=ax
    )

    ax.set_title(
        f'Distribution of {period_map.get(pay,pay)} by Default Status'
    )

    ax.set_xlabel(
        'Default Status'
    )

    ax.set_ylabel(
        f'{period_map.get(pay,pay)} Amount'
    )

    ax.set_xticks([0,1])
    ax.set_xticklabels(
        ['No Default','Default']
    )

    ax.grid(
        axis='y',
        linestyle='--',
        alpha=0.7
    )

    st.pyplot(fig)

def vis_countplot(pay, data):

    period_map = {
        'PAY_1': 'Current Month',
        'PAY_2': '1 Month Before',
        'PAY_3': '2 Months Before',
        'PAY_4': '3 Months Before',
        'PAY_5': '4 Months Before',
        'PAY_6': '5 Months Before'
    }

    fig, ax = plt.subplots(figsize=(8,6))

    sns.countplot(
        x=pay,
        hue='default',
        data=data,
        palette='viridis',
        ax=ax
    )

    ax.set_title(
        f'Distribution of Repayment Status ({period_map.get(pay,pay)})'
    )

    ax.set_xlabel(
        "Repayment Status"
    )

    ax.set_ylabel(
        "Number of Clients"
    )

    ax.grid(
        axis='y',
        linestyle='--',
        alpha=0.7
    )

    st.pyplot(fig)

# Load dataset
baseline = pd.read_csv("data/credit_baseline.csv")
final = pd.read_csv("data/credit_final.csv")

st.sidebar.title("Navigasi")

st.markdown("""
<style>
/* Hilangkan cursor I */
div[data-baseweb="select"] input {
    caret-color: transparent !important;
    cursor: pointer !important;
}

/* Disable ketik */
div[data-baseweb="select"] input:focus {
    outline: none !important;
}

div[data-baseweb="select"] input::selection {
    background: transparent !important;
}

/* Cursor seluruh area jadi pointer */
div[data-baseweb="select"] * {
    cursor: pointer !important;
}
</style>
""", unsafe_allow_html=True)

page = st.sidebar.selectbox(
        "Pilih Halaman",
    [
        "Home",
        "Analisis Fitur (RQ1)",
        "Feature Engineering (RQ2)",
        "Model Evaluation (RQ3)"
    ]
)

# ==================
# HOME
# ==================

if page=="Home":

    st.title("Credit Default Prediction Dashboard")

    st.markdown("""
    Dashboard ini digunakan untuk menganalisis faktor-faktor yang memengaruhi risiko gagal bayar pengguna kartu kredit.
    """)

    col1,col2,col3=st.columns(3)

    with col1:
        st.metric(
            "Jumlah Data",
            baseline.shape[0]
        )

    with col2:
        st.metric(
            "Jumlah Fitur",
            baseline.shape[1]-1
        )

    with col3:
        st.metric(
            "Target",
            "Default"
        )

    st.subheader("Business Questions")

    st.markdown("""
    **RQ1**
    
    Faktor apa saja yang paling memengaruhi risiko gagal bayar pengguna berdasarkan data penggunaan kartu kredit dan riwayat pembayaran dalam beberapa bulan terakhir?

    **RQ2**
    
    Bagaimana hubungan antara rasio utang dan keterlambatan pembayaran terhadap risiko gagal bayar berdasarkan histori data transaksi?

    **RQ3**
    
    Model machine learning apa yang memiliki kemampuan terbaik dalam mendeteksi risiko gagal bayar pengguna berdasarkan metrik evaluasi recall, F1-score, dan ROC-AUC?
    """)

    st.title("Distribusi Target")

    fig, ax = plt.subplots(figsize=(10, 6))

    # Hitung jumlah kelas
    default_counts = baseline['default'].value_counts().sort_index()

    # Buat bar chart
    bars = ax.bar(
        default_counts.index,
        default_counts.values
    )   

    ax.set_xlabel('Status Gagal Bayar')
    ax.set_ylabel('Jumlah Pengguna')
    ax.set_xticks([0,1])
    ax.set_xticklabels(['Tidak Gagal Bayar', 'Gagal Bayar'])

    # Tambahkan label jumlah di atas bar
    for bar in bars:
        yval = bar.get_height()
        ax.text(
            bar.get_x() + bar.get_width()/2,
            yval + 100,
            round(yval, 2),
            ha='center',
            va='bottom'
        )

    st.pyplot(fig)

    st.markdown("""
    **Insight:**

    Mayoritas pengguna berada pada kategori **No Default**, yang menunjukkan distribusi data tidak seimbang (*imbalanced dataset*). Oleh karena itu, proses pemodelan perlu memperhatikan metrik evaluasi selain accuracy seperti **Recall**, **F1-score**, dan **ROC-AUC** agar model tetap mampu mendeteksi pengguna yang berisiko gagal bayar.
    """)

# ==================
# EDA
# ==================

elif page=="Analisis Fitur (RQ1)":

    st.title("Analisis Fitur — Faktor Risiko Gagal Bayar")

    st.info("""
    Tab ini menampilkan hasil analisis pada **dataset asli (baseline)** sebelum dilakukan proses *feature engineering*. 
    Analisis bertujuan untuk mengidentifikasi pola awal dan faktor-faktor yang berhubungan dengan risiko gagal bayar berdasarkan fitur asli seperti **riwayat pembayaran**, **tagihan**, **jumlah pembayaran**, serta **fitur demografi**.
    """)

    corr_features = baseline.columns.tolist()

    # Hitung matriks korelasi
    corr_matrix = baseline[corr_features].corr()

    # Ambil korelasi terhadap target
    default_correlations = (
        corr_matrix['default']
        .sort_values(ascending=False)
        .drop('default')
    )

    fig, ax = plt.subplots(figsize=(12, 8))

    sns.barplot(
        x=default_correlations.values,
        y=default_correlations.index,
        hue=default_correlations.index,
        palette='viridis',
        legend=False,
        ax=ax
    )

    ax.set_title('Korelasi Fitur terhadap Risiko Gagal Bayar',fontsize=14)

    ax.set_xlabel('Koefisien Korelasi')
    ax.set_ylabel('Fitur')

    ax.axvline(
        0,
        color='black',
        linewidth=1
    )

    ax.grid(
        axis='x',
        linestyle='--',
        alpha=0.7
    )

    st.pyplot(fig)

    st.markdown(""" **Insight:** Hasil *correlation analysis* menunjukkan bahwa fitur yang berkaitan dengan **riwayat pembayaran** (`PAY_X`) memiliki hubungan yang lebih kuat terhadap risiko gagal bayar dibandingkan fitur demografi seperti **jenis kelamin**, **pendidikan**, dan **status pernikahan**. Temuan ini menjadi dasar untuk memfokuskan pemodelan pada perilaku finansial pengguna.""")

    st.divider()

    # ==========================
    # Interactive Analysis
    # ==========================

    st.subheader("Analisis Riwayat Pembayaran")

    period_map = {
        'PAY_1': 'Current Month',
        'PAY_2': '1 Month Before',
        'PAY_3': '2 Months Before',
        'PAY_4': '3 Months Before',
        'PAY_5': '4 Months Before',
        'PAY_6': '5 Months Before'
    }

    selected_pay = st.selectbox(
        "Pilih periode pembayaran:",
        options=list(period_map.keys()),
        format_func=lambda x: period_map[x]
    )

    payment_map = {
        'PAY_1':'PAY_AMT1',
        'PAY_2':'PAY_AMT2',
        'PAY_3':'PAY_AMT3',
        'PAY_4':'PAY_AMT4',
        'PAY_5':'PAY_AMT5',
        'PAY_6':'PAY_AMT6'
    }

    col1,col2 = st.columns(2)

    with col1:

        st.markdown(
            f"**Status Pembayaran ({period_map[selected_pay]})**"
        )

        vis_countplot(
            selected_pay,
            baseline
        )

    with col2:

        st.markdown(
            f"**Nominal Pembayaran ({period_map[selected_pay]})**"
        )

        vis_boxplot(
            payment_map[selected_pay],
            baseline
        )

    st.markdown("""
    Pengguna dengan keterlambatan pembayaran yang lebih tinggi cenderung memiliki risiko gagal bayar lebih besar. Selain itu, pengguna dengan nominal pembayaran lebih rendah juga menunjukkan kecenderungan mengalami gagal bayar.
    """)

    with st.expander("Kesimpulan Analisis RQ1", expanded=True):

        st.markdown("""
        **Penjelasan:**

        Berdasarkan hasil **Exploratory Data Analysis (EDA)**, fitur yang berkaitan dengan kondisi finansial dan riwayat pembayaran menunjukkan hubungan yang lebih kuat terhadap risiko gagal bayar dibandingkan fitur demografi seperti **jenis kelamin**, **pendidikan**, dan **status pernikahan**.

        Oleh karena itu, pada tahap selanjutnya fitur demografi sengaja tidak digunakan dalam proses pemodelan. Keputusan ini diambil untuk menyederhanakan kebutuhan input pengguna pada sistem, sehingga pengguna tidak perlu memasukkan informasi yang kurang relevan terhadap prediksi.

        Selain itu, penghapusan fitur demografi juga bertujuan mengurangi potensi bias pada model agar prediksi lebih berfokus pada perilaku finansial dan riwayat pembayaran pengguna. Hal ini didukung oleh hasil *correlation analysis* yang menunjukkan bahwa fitur **repayment status (PAY_1–PAY_6)** memiliki korelasi lebih tinggi terhadap risiko gagal bayar dibandingkan fitur demografi.

        Selain itu, penggunaan riwayat pembayaran selama **tiga bulan terakhir** dipilih karena dinilai sudah mampu merepresentasikan perilaku pembayaran pengguna sekaligus menyederhanakan kebutuhan input sistem pada tahap implementasi.
        """)
# ==================
# FEATURE ENGINEERING
# ==================

elif page=="Feature Engineering (RQ2)":

    st.title("Analisis Penambahan Fitur dengan Feature Engineering")

    st.info("""
    Tab ini menampilkan hasil analisis setelah dilakukan proses **feature engineering** dan penyederhanaan fitur.

    Perubahan yang dilakukan meliputi:

    a. Menghapus fitur demografi:
        - `SEX`
        - `EDUCATION`
        - `MARRIAGE`
        - `AGE`

    b. Membatasi histori transaksi menjadi **3 bulan terakhir**:
        - `PAY_1–PAY_3`
        - `BILL_AMT1–BILL_AMT3`
        - `PAY_AMT1–PAY_AMT3`

    c. Menambahkan fitur hasil *feature engineering*:
        - `total_bill` → total tagihan selama 3 bulan
        - `total_payment` → total pembayaran selama 3 bulan
        - `debt_ratio` → rasio total tagihan terhadap limit kredit
        - `avg_delay` → rata-rata keterlambatan pembayaran
        - `payment_ratio` → rasio total pembayaran terhadap total tagihan

    Tujuan proses ini adalah menyederhanakan kebutuhan input pengguna, mengurangi potensi bias, serta menghasilkan representasi perilaku finansial yang lebih ringkas untuk proses pemodelan.
    """)

    st.subheader("Hubungan Antara Fitur Engineering dengan Risiko Gagal Bayar")

    financial_features = [
        'LIMIT_BAL',
        'total_bill',
        'total_payment',
        'debt_ratio',
        'avg_delay',
        'payment_ratio',
        'default'
    ]

    corr_matrix = final[financial_features].corr()

    fig, ax = plt.subplots(figsize=(12,8))

    sns.heatmap(
        corr_matrix,
        annot=True,
        cmap='coolwarm',
        fmt='.2f',
        linewidths=0.5,
        ax=ax
    )

    ax.set_title(
        'Correlation Heatmap: Financial Features and Default Risk',
        fontsize=14
    )

    st.pyplot(fig)

    st.markdown("""
    **Insight:**

    Hasil *correlation analysis* menunjukkan bahwa fitur hasil *feature engineering* seperti **debt_ratio**, **avg_delay**, dan **payment_ratio** memiliki hubungan terhadap risiko gagal bayar. Fitur-fitur ini membantu merangkum perilaku finansial pengguna menjadi representasi yang lebih sederhana dibandingkan menggunakan seluruh histori transaksi secara terpisah.
    """)

    st.subheader(
    "Distribusi Fitur Engineering terhadap Risiko Gagal Bayar"
    )

    boxplot_features = [
        'debt_ratio',
        'payment_ratio',
        'avg_delay'
    ]

    feature_names = {
        'debt_ratio': 'Debt Ratio',
        'payment_ratio': 'Payment Ratio',
        'avg_delay': 'Average Payment Delay'
    }

    col1, col2, col3 = st.columns(3)

    cols = [col1, col2, col3]

    for col, feature in zip(cols, boxplot_features):
        with col:
            fig, ax = plt.subplots(figsize=(5,4))

            sns.boxplot(
                x='default',
                y=feature,
                data=final,
                palette='viridis',
                hue='default',
                legend=False,
                showfliers=False,
                ax=ax
            )

            ax.set_title(
                f'{feature_names[feature]}',
                fontsize=11
            )

            ax.set_xlabel(
                'Default Status'
            )

            ax.set_ylabel(
                feature_names[feature]
            )

            ax.set_xticks([0,1])
            ax.set_xticklabels(
                ['No Default','Default']
            )

            st.pyplot(fig)
    
    st.markdown("""
    Berdasarkan hasil correlation analysis dan visualisasi distribusi data, fitur hasil feature engineering seperti avg_delay dan debt_ratio memiliki hubungan yang lebih kuat terhadap risiko gagal bayar dibandingkan sebagian fitur finansial asli. 
    Oleh karena itu, fitur-fitur tersebut layak digunakan pada tahap pemodelan machine learning untuk meningkatkan kemampuan model dalam mendeteksi risiko gagal bayar.
    """)

    with st.expander("Kesimpulan Analisis RQ2", expanded=True):

        st.markdown("""
        **Penjelasan:**

        Berdasarkan hasil analisis menggunakan **boxplot**, kelompok pengguna yang mengalami **gagal bayar (default)** memiliki median dan distribusi **debt_ratio** yang lebih tinggi dibandingkan kelompok **non-default**. Hal ini menunjukkan bahwa pengguna dengan proporsi utang yang lebih besar terhadap batas kredit cenderung memiliki risiko gagal bayar yang lebih tinggi.

        Sebaliknya, kelompok **non-default** cenderung memiliki **payment_ratio** yang lebih tinggi, yang menunjukkan kemampuan pembayaran yang lebih baik terhadap total tagihan yang dimiliki. Semakin tinggi rasio pembayaran, semakin besar kemampuan pengguna dalam melunasi kewajibannya.

        Selain itu, distribusi **avg_delay** pada kelompok **default** bergeser ke nilai yang lebih tinggi dibandingkan kelompok **non-default**, yang mengindikasikan bahwa keterlambatan pembayaran memiliki hubungan yang kuat terhadap risiko gagal bayar.

        Temuan ini menunjukkan bahwa fitur hasil **feature engineering** mampu merepresentasikan perilaku finansial pengguna secara lebih ringkas dan informatif, sehingga dapat digunakan sebagai fitur pendukung yang relevan pada tahap pemodelan machine learning.
        """)

# ==================
# MODEL
# ==================

elif page=="Model Evaluation (RQ3)":

    st.title("Model Evaluation")

    st.info("""
    Tab ini menampilkan hasil evaluasi model machine learning yang digunakan untuk memprediksi risiko gagal bayar.

    Pada tahap ini dilakukan perbandingan antara dua model:

    - Logistic Regression
    - Random Forest

    Evaluasi dilakukan menggunakan beberapa metrik seperti:
    Accuracy, Precision, Recall, F1-score, dan ROC-AUC.
    """)

    # ==========================
    # Metrics Table
    # ==========================

    st.subheader("Perbandingan Performa Model")

    st.markdown("""
    Tabel berikut menunjukkan perbandingan performa antara **Logistic Regression** dan **Random Forest** berdasarkan metrik evaluasi model secara keseluruhan (*overall performance*). Nilai precision, recall, dan F1-score menggunakan pendekatan **weighted average** untuk menyesuaikan kondisi **class imbalance** pada dataset.
    """)
    metrics = pd.DataFrame({

    "Metric":[
        "Accuracy",
        "Precision",
        "Recall",
        "F1-Score",
        "ROC-AUC"
    ],

    "Logistic Regression":[
        0.68,
        0.75,
        0.68,
        0.70,
        0.71
    ],

    "Random Forest":[
        0.78,
        0.79,
        0.78,
        0.78,
        0.77
    ]
})

    st.dataframe(
        metrics,
        use_container_width=True
    )

    st.divider()

    # ==========================
    # Confusion Matrix
    # ==========================

    st.subheader(
        "Confusion Matrix"
    )

    col1, col2 = st.columns(2)

    labels = [
        'Aman',
        'Gagal Bayar'
    ]

    # Logistic Regression

    with col1:

        st.markdown(
            "**Logistic Regression**"
        )

        cm_lr = np.array([
            [3169,1504],
            [482,845]
        ])

        fig, ax = plt.subplots(figsize=(5,4))

        sns.heatmap(
            cm_lr,
            annot=True,
            fmt='d',
            cmap='Blues',
            cbar=False,
            xticklabels=labels,
            yticklabels=labels,
            ax=ax
        )

        ax.set_xlabel(
            "Predicted"
        )

        ax.set_ylabel(
            "Actual"
        )

        st.pyplot(fig)


    # Random Forest

    with col2:

        st.markdown(
            "**Random Forest**"
        )

        cm_rf = np.array([
            [3980,693],
            [585,742]
        ])

        fig, ax = plt.subplots(figsize=(5,4))

        sns.heatmap(
            cm_rf,
            annot=True,
            fmt='d',
            cmap='Blues',
            cbar=False,
            xticklabels=labels,
            yticklabels=labels,
            ax=ax
        )

        ax.set_xlabel(
            "Predicted"
        )

        ax.set_ylabel(
            "Actual"
        )

        st.pyplot(fig)

    st.divider()

    # ==========================
    # Final Conclusion
    # ==========================

    with st.expander(
        "Kesimpulan Analisis RQ3",
        expanded=True
    ):

        st.markdown("""
        **Penjelasan:**

        Dalam project ini dilakukan perbandingan antara **Logistic Regression** dan **Random Forest** untuk mengevaluasi performa model dalam memprediksi risiko gagal bayar.

        Random Forest yang telah melalui proses *hyperparameter tuning* menunjukkan performa yang lebih tinggi dari segi **akurasi** dan **ROC-AUC**, yang mengindikasikan kemampuan model dalam menangkap pola data yang lebih kompleks.

        Namun, dalam konteks prediksi gagal bayar, metrik **recall** menjadi fokus utama karena berkaitan langsung dengan kemampuan model dalam mendeteksi nasabah yang berpotensi mengalami gagal bayar.

        Hasil evaluasi menunjukkan bahwa **Logistic Regression memiliki nilai recall lebih tinggi dibandingkan Random Forest**, sehingga lebih efektif dalam mengidentifikasi kasus berisiko.

        Selain itu, dataset memiliki kondisi **class imbalance**, di mana jumlah nasabah yang tidak gagal bayar lebih dominan dibandingkan nasabah gagal bayar. Pada kondisi seperti ini, metrik seperti **akurasi** dan **ROC-AUC** kurang representatif jika digunakan sebagai satu-satunya dasar pemilihan model.

        Dalam konteks sistem keuangan, kesalahan dalam mendeteksi nasabah berisiko (*false negative*) memiliki dampak yang lebih besar dibandingkan *false positive* karena dapat menyebabkan kerugian finansial.

        Berdasarkan pertimbangan tersebut, **Logistic Regression dipilih sebagai model utama** karena lebih sesuai dengan tujuan penelitian dalam mendukung mitigasi risiko kredit, sedangkan **Random Forest** digunakan sebagai model pembanding untuk menunjukkan potensi peningkatan performa model.
    """)