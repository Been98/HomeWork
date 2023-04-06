#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <string.h>
#include <netinet/in.h>
#include <sys/stat.h>
#include <unistd.h>
#include <sys/un.h>
#include <fcntl.h>

#define BUF_SIZE 256
#define SOCK_ADDR "./sock_addr"

int main(int argc, char *argv[])
{
    int sd, client, len, sd2, client2,len2;
    struct sockaddr_un server_addr; 
    struct sockaddr client_addr; 

    struct sockaddr_in addr; 
    struct sockaddr_in client_addr2;

    char buf[BUF_SIZE] = {0,};
    char buf2[BUF_SIZE] = {0,};
    sd = socket(AF_UNIX, SOCK_STREAM, 0);
    if (sd == -1)
    {
        perror("socket");
        exit(1);
    }
    sd2 = socket(AF_INET, SOCK_STREAM, 0);
    if (sd2 == -1)
    {
        perror("Socket Error\n");
        exit(1);
    }
    server_addr.sun_family = AF_UNIX;
    strcpy(server_addr.sun_path, SOCK_ADDR);

    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = htonl(INADDR_ANY);
    addr.sin_port = htons(5010);

    if (bind(sd, (struct sockaddr *)&server_addr, sizeof(server_addr)) == -1)
    {
        perror("bind");
        exit(1);
    }
    if (listen(sd, 5) == -1)
    {
        perror("listen");
        exit(1);
    }
    if (bind(sd2, (struct sockaddr *)&addr, sizeof(addr)) == -1)
    {
        perror("bind");
        exit(1);
    }
    if (listen(sd2, 5) == -1)
    {
        perror("listen");
        exit(1);
    }
    printf("[Info] Unix socket :  waiting for conn req\n");
    client = accept(sd, &client_addr, &len);
    if(client != -1)
        printf("[Info] Unix socket : clinet connected\n");
    printf("[Info] Inet socket : waiting for conn req\n");
    client2 = accept(sd2, (struct sockaddr *)&client_addr2, &len2);
    if(client2 != -1)
        printf("[Info] Inet socket : client connected\n");
    int flags = fcntl(client, F_GETFL, 0);
    fcntl(client, F_SETFL,flags | O_NONBLOCK);
    flags = fcntl(client2, F_GETFL, 0);
    fcntl(client2, F_SETFL, flags | O_NONBLOCK);
    int a = 0;
    while (1)
    {
        if(recv(client, buf, BUF_SIZE, 0) != -1){
        	printf("[ME] : %s\n", buf);
       		 if (send(client2, buf, BUF_SIZE, 0) == -1 && a ==0)
      		{	
           	 perror("print Send(Inet) Error\n");
           	 exit(1);
        	}
		if(strncmp(buf,"quit",strlen("quit")) ==0) {
			printf("[Server] quit\n");
			break;
		
			}
	}
        memset(buf, 0, BUF_SIZE);
        if(recv(client2, buf2, BUF_SIZE, 0) != -1 && a == 0){
       		 printf("[YOU] : %s\n",buf2);
		 if(strncmp(buf2, "quit", strlen("quit")) == 0){
			 a = 1;
			 close(sd2);
			 close(client2);
		 }
	}
        memset(buf2,0,BUF_SIZE);
    }
    close(sd);
    close(client);
    close(sd2);
    close(client2);
    printf("[Info] Closing sockets\n");
}

