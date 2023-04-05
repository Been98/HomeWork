#include <iostream>
#include <string>

using namespace std;

class Matrix
{
    int ar[4];

public:
    Matrix(int a1 = 0, int a2 = 0, int b1 = 0, int b2 = 0);
    void show(string matrix);
    Matrix operator+(Matrix m);
    Matrix& operator+=(Matrix m);
    Matrix& operator<<(int a[]);
    Matrix& operator>>(int a[]);
};
Matrix::Matrix(int a1, int a2, int b1, int b2){
    ar[0] = a1;
    ar[1] = a2;
    ar[2] = b1;
    ar[3] = b2;
}
void Matrix::show(string matrix){
    cout << "====="<<matrix<<"=====" <<endl;
    cout <<"Matrix = { ";
    for(int i = 0; i < 4; i++){
        cout <<ar[i]<<" ";
    }
    cout <<"}"<<endl;
}
Matrix Matrix::operator+(Matrix m){
    int b[4];
    for(int i=0; i < 4; i++){
        b[i] = ar[i]+ m.ar[i];
    }
    return Matrix(b[0],b[1],b[2],b[3]);
}
Matrix& Matrix::operator+=(Matrix m){
    for (int i = 0; i < 4; i++){
        ar[i] += m.ar[i];
    }
    return *this;
}
Matrix& Matrix::operator>>(int a[]){
    for (int i = 0; i < 4; i++) {
        a[i] = ar[i];
    }
    return *this;
}
Matrix &Matrix::operator<<(int a[]){
    for (int i = 0; i < 4; i++){
        ar[i] = a[i];
    }
    return *this;
}

int main()
{
    Matrix a(1, 2, 3, 4), b(2, 3, 4, 5), c;
    c = a + b;
    a += b;
    a.show("matrix a");
    b.show("matrix b");
    c.show("matrix c");

    int x[4], y[4] = {5, 6, 7, 8};
    a >> x; // a의 각 원소를 배열 x에 복사. x[]는 {4,3,2,1}
    b << y; // 배열 y의 원소 값을 b의 각 원소에 설정

    cout << ">> 배열 x의 원소 출력 << " <<endl;
    for (int i = 0; i < 4; i++)
    cout << x[i] << ' '; // x[] 출력
    cout << endl;
    cout << ">> 배열 y값을 객체(b)에 복사 << " << endl;
    b.show("matrix b");
}